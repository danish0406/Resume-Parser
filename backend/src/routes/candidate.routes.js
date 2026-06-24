const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, candidateController.getAllCandidates);
router.get('/:id', verifyToken, candidateController.getCandidateDetail);
router.patch('/:id/status', verifyToken, candidateController.updateCandidateStatus);
router.delete('/:id', verifyToken, candidateController.deleteCandidate);

module.exports = router;
