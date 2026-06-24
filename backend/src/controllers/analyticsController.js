const pool = require('../config/db');
const { formatSuccess } = require('../utils/responseFormatter');

const getDashboardStats = async (req, res, next) => {
  try {
    const [[{ totalCandidates }]] = await pool.query('SELECT COUNT(*) AS totalCandidates FROM candidates');
    const [[{ avgScore }]] = await pool.query('SELECT ROUND(COALESCE(AVG(score), 0)) AS avgScore FROM candidates');
    const [[{ shortlisted }]] = await pool.query("SELECT COUNT(*) AS shortlisted FROM candidates WHERE status = 'shortlisted'");
    const [[{ totalJobs }]] = await pool.query('SELECT COUNT(*) AS totalJobs FROM job_descriptions');

    // Fetch recent uploads (last 5 candidates)
    const [recentCandidates] = await pool.query(
      'SELECT id, name, email, score, status, uploaded_at FROM candidates ORDER BY uploaded_at DESC LIMIT 5'
    );

    // Fetch skills for recent uploads
    for (let i = 0; i < recentCandidates.length; i++) {
      const [skills] = await pool.query('SELECT skill_name, category FROM skills WHERE candidate_id = ? LIMIT 3', [recentCandidates[i].id]);
      recentCandidates[i].skills = skills;
    }

    res.json(formatSuccess({
      stats: {
        totalCandidates: totalCandidates || 0,
        avgScore: avgScore || 0,
        shortlisted: shortlisted || 0,
        totalJobs: totalJobs || 0
      },
      recentCandidates
    }));
  } catch (error) {
    next(error);
  }
};

const getSkillsAnalytics = async (req, res, next) => {
  try {
    const [skills] = await pool.query(
      `SELECT skill_name, COUNT(*) AS count, category
       FROM skills 
       GROUP BY skill_name, category 
       ORDER BY count DESC 
       LIMIT 12`
    );
    res.json(formatSuccess(skills));
  } catch (error) {
    next(error);
  }
};

const getScoreDistribution = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT score FROM candidates');
    
    // Bucket scores in JS for database vendor independence and safety
    const distribution = [
      { range: '0-20', count: 0 },
      { range: '21-40', count: 0 },
      { range: '41-60', count: 0 },
      { range: '61-80', count: 0 },
      { range: '81-100', count: 0 }
    ];

    rows.forEach(row => {
      const score = row.score;
      if (score <= 20) distribution[0].count++;
      else if (score <= 40) distribution[1].count++;
      else if (score <= 60) distribution[2].count++;
      else if (score <= 80) distribution[3].count++;
      else distribution[4].count++;
    });

    res.json(formatSuccess(distribution));
  } catch (error) {
    next(error);
  }
};

const getStatusBreakdown = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT status, COUNT(*) AS count FROM candidates GROUP BY status');
    
    // Ensure all statuses are represented
    const breakdown = {
      new: 0,
      shortlisted: 0,
      rejected: 0,
      interview: 0
    };

    rows.forEach(row => {
      breakdown[row.status] = row.count;
    });

    const result = Object.keys(breakdown).map(status => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count: breakdown[status]
    }));

    res.json(formatSuccess(result));
  } catch (error) {
    next(error);
  }
};

const getUploadTrends = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT DATE_FORMAT(uploaded_at, '%Y-%m') AS month, COUNT(*) AS count 
       FROM candidates 
       GROUP BY month 
       ORDER BY month ASC 
       LIMIT 12`
    );

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const formatted = rows.map(row => {
      const [year, monthNum] = row.month.split('-');
      const monthName = monthNames[parseInt(monthNum) - 1];
      return {
        period: `${monthName} ${year}`,
        count: row.count
      };
    });

    // Provide default data if empty so graph looks premium
    if (formatted.length === 0) {
      formatted.push({ period: 'Current Month', count: 0 });
    }

    res.json(formatSuccess(formatted));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getSkillsAnalytics,
  getScoreDistribution,
  getStatusBreakdown,
  getUploadTrends
};
