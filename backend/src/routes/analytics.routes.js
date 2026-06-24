const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/dashboard', verifyToken, analyticsController.getDashboardStats);
router.get('/skills', verifyToken, analyticsController.getSkillsAnalytics);
router.get('/scores', verifyToken, analyticsController.getScoreDistribution);
router.get('/status', verifyToken, analyticsController.getStatusBreakdown);
router.get('/trends', verifyToken, analyticsController.getUploadTrends);

module.exports = router;
