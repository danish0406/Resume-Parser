const pool = require('../config/db');
const claudeService = require('./claudeService');

const matchCandidateWithJob = async (candidateId, jobId) => {
  // 1. Fetch Candidate from DB
  const [candidates] = await pool.query('SELECT * FROM candidates WHERE id = ?', [candidateId]);
  if (candidates.length === 0) {
    throw new Error('Candidate not found');
  }
  const candidate = candidates[0];

  // Fetch candidate skills
  const [skills] = await pool.query('SELECT skill_name, category FROM skills WHERE candidate_id = ?', [candidateId]);
  candidate.skills = skills;

  // Fetch candidate experience
  const [experience] = await pool.query('SELECT * FROM experience WHERE candidate_id = ?', [candidateId]);
  candidate.experience = experience;

  // 2. Fetch Job Description from DB
  const [jobs] = await pool.query('SELECT * FROM job_descriptions WHERE id = ?', [jobId]);
  if (jobs.length === 0) {
    throw new Error('Job description not found');
  }
  const job = jobs[0];

  // 3. Call Claude Matching
  const matchResult = await claudeService.getJobMatch(job, candidate);

  // 4. Save to Matches Table
  const [existingMatches] = await pool.query('SELECT id FROM matches WHERE job_id = ? AND candidate_id = ?', [jobId, candidateId]);
  
  const matchedSkillsStr = Array.isArray(matchResult.matched_skills) ? matchResult.matched_skills.join(',') : '';
  const missingSkillsStr = Array.isArray(matchResult.missing_skills) ? matchResult.missing_skills.join(',') : '';

  if (existingMatches.length > 0) {
    await pool.query(
      'UPDATE matches SET match_score = ?, matched_skills = ?, missing_skills = ? WHERE job_id = ? AND candidate_id = ?',
      [matchResult.match_score, matchedSkillsStr, missingSkillsStr, jobId, candidateId]
    );
  } else {
    await pool.query(
      'INSERT INTO matches (job_id, candidate_id, match_score, matched_skills, missing_skills) VALUES (?, ?, ?, ?, ?)',
      [jobId, candidateId, matchResult.match_score, matchedSkillsStr, missingSkillsStr]
    );
  }

  return {
    job_id: jobId,
    candidate_id: candidateId,
    match_score: matchResult.match_score,
    matched_skills: Array.isArray(matchResult.matched_skills) ? matchResult.matched_skills : matchedSkillsStr.split(',').filter(Boolean),
    missing_skills: Array.isArray(matchResult.missing_skills) ? matchResult.missing_skills : missingSkillsStr.split(',').filter(Boolean)
  };
};

module.exports = {
  matchCandidateWithJob
};
