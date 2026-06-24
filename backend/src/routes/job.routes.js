const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const verifyToken = require('../middleware/authMiddleware');
const { validateJob } = require('../middleware/validateRequest');

router.post('/', verifyToken, validateJob, jobController.createJobDescription);
router.get('/', verifyToken, jobController.getAllJobs);
router.post('/match', verifyToken, jobController.matchCandidate);
router.get('/:id/rankings', verifyToken, jobController.getJobMatchRankings);

module.exports = router;
