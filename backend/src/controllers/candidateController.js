const pool = require('../config/db');
const { formatSuccess, formatError } = require('../utils/responseFormatter');

const getAllCandidates = async (req, res, next) => {
  try {
    const { search, skill, minScore, maxScore, status } = req.query;
    
    let query = 'SELECT c.* FROM candidates c WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (c.name LIKE ? OR c.email LIKE ? OR c.summary LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (minScore) {
      query += ' AND c.score >= ?';
      params.push(parseInt(minScore));
    }

    if (maxScore) {
      query += ' AND c.score <= ?';
      params.push(parseInt(maxScore));
    }

    if (status) {
      query += ' AND c.status = ?';
      params.push(status);
    }

    // Filter by specific skill in skills table if specified
    if (skill) {
      query += ' AND EXISTS (SELECT 1 FROM skills s WHERE s.candidate_id = c.id AND s.skill_name LIKE ?)';
      params.push(`%${skill}%`);
    }

    query += ' ORDER BY c.uploaded_at DESC';

    const [candidates] = await pool.query(query, params);

    // Fetch skills for each candidate to display in lists
    for (let i = 0; i < candidates.length; i++) {
      const [skills] = await pool.query('SELECT skill_name, category FROM skills WHERE candidate_id = ? LIMIT 5', [candidates[i].id]);
      candidates[i].skills = skills;
    }

    res.json(formatSuccess(candidates));
  } catch (error) {
    next(error);
  }
};

const getCandidateDetail = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [candidates] = await pool.query('SELECT * FROM candidates WHERE id = ?', [id]);
    if (candidates.length === 0) {
      return res.status(404).json(formatError('Candidate not found.'));
    }
    const candidate = candidates[0];

    // Fetch Skills
    const [skills] = await pool.query('SELECT * FROM skills WHERE candidate_id = ?', [id]);
    candidate.skills = skills;

    // Fetch Experience
    const [experience] = await pool.query('SELECT * FROM experience WHERE candidate_id = ? ORDER BY start_date DESC', [id]);
    candidate.experience = experience;

    // Fetch Education
    const [education] = await pool.query('SELECT * FROM education WHERE candidate_id = ? ORDER BY start_year DESC', [id]);
    candidate.education = education;

    // Fetch Certifications
    const [certifications] = await pool.query('SELECT * FROM certifications WHERE candidate_id = ? ORDER BY issued_date DESC', [id]);
    candidate.certifications = certifications;

    // Fetch Matches with Job Descriptions
    const [matches] = await pool.query(
      `SELECT m.*, jd.title AS job_title, jd.company AS job_company 
       FROM matches m 
       JOIN job_descriptions jd ON m.job_id = jd.id 
       WHERE m.candidate_id = ? 
       ORDER BY m.match_score DESC`, 
      [id]
    );
    candidate.matches = matches;

    res.json(formatSuccess(candidate));
  } catch (error) {
    next(error);
  }
};

const updateCandidateStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['new', 'shortlisted', 'rejected', 'interview'].includes(status)) {
    return res.status(400).json(formatError('Invalid status value. Must be new, shortlisted, rejected, or interview.'));
  }

  try {
    const [result] = await pool.query('UPDATE candidates SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json(formatError('Candidate not found.'));
    }
    res.json(formatSuccess({ id, status }, 'Candidate status updated.'));
  } catch (error) {
    next(error);
  }
};

const deleteCandidate = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM candidates WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json(formatError('Candidate not found.'));
    }
    res.json(formatSuccess({ id }, 'Candidate deleted successfully.'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCandidates,
  getCandidateDetail,
  updateCandidateStatus,
  deleteCandidate
};
