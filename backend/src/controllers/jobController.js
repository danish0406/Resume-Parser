const pool = require('../config/db');
const { matchCandidateWithJob } = require('../services/matchService');
const { formatSuccess, formatError } = require('../utils/responseFormatter');

const createJobDescription = async (req, res, next) => {
  const { title, company, description, required_skills } = req.body;
  const userId = req.user.id;

  try {
    const [result] = await pool.query(
      `INSERT INTO job_descriptions (user_id, title, company, description, required_skills) VALUES (?, ?, ?, ?, ?)`,
      [userId, title, company, description, required_skills]
    );

    const jobId = result.insertId;

    // Trigger match calculations for all existing candidates in background
    const [candidates] = await pool.query('SELECT id FROM candidates');
    for (const candidate of candidates) {
      matchCandidateWithJob(candidate.id, jobId).catch(err => {
        console.error(`Failed background match for candidate ${candidate.id} and job ${jobId}:`, err.message);
      });
    }

    res.status(201).json(formatSuccess({
      id: jobId,
      title,
      company,
      description,
      required_skills
    }, 'Job description created successfully.'));

  } catch (error) {
    next(error);
  }
};

const getAllJobs = async (req, res, next) => {
  try {
    const [jobs] = await pool.query('SELECT * FROM job_descriptions ORDER BY created_at DESC');
    res.json(formatSuccess(jobs));
  } catch (error) {
    next(error);
  }
};

const matchCandidate = async (req, res, next) => {
  const { jobId, candidateId } = req.body;
  if (!jobId || !candidateId) {
    return res.status(400).json(formatError('Job ID and Candidate ID are required.'));
  }

  try {
    const matchData = await matchCandidateWithJob(candidateId, jobId);
    res.json(formatSuccess(matchData, 'Matching complete.'));
  } catch (error) {
    next(error);
  }
};

const getJobMatchRankings = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [jobs] = await pool.query('SELECT * FROM job_descriptions WHERE id = ?', [id]);
    if (jobs.length === 0) {
      return res.status(404).json(formatError('Job description not found.'));
    }
    const job = jobs[0];

    const [candidates] = await pool.query('SELECT id, name, email, score, status FROM candidates');

    const rankings = [];
    for (const candidate of candidates) {
      let [matchResult] = await pool.query('SELECT * FROM matches WHERE job_id = ? AND candidate_id = ?', [id, candidate.id]);
      
      let matchScore;
      let matchedSkills = [];
      let missingSkills = [];

      if (matchResult.length === 0) {
        try {
          const matchData = await matchCandidateWithJob(candidate.id, id);
          matchScore = matchData.match_score;
          matchedSkills = matchData.matched_skills;
          missingSkills = matchData.missing_skills;
        } catch (matchErr) {
          console.error(`On-the-fly match failed for candidate ${candidate.id} and job ${id}:`, matchErr.message);
          matchScore = 0;
        }
      } else {
        const m = matchResult[0];
        matchScore = m.match_score;
        matchedSkills = m.matched_skills ? m.matched_skills.split(',') : [];
        missingSkills = m.missing_skills ? m.missing_skills.split(',') : [];
      }

      rankings.push({
        candidate_id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        candidate_score: candidate.score,
        status: candidate.status,
        match_score: matchScore,
        matched_skills: matchedSkills,
        missing_skills: missingSkills
      });
    }

    rankings.sort((a, b) => b.match_score - a.match_score);

    res.json(formatSuccess({
      job,
      rankings
    }));

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJobDescription,
  getAllJobs,
  matchCandidate,
  getJobMatchRankings
};
