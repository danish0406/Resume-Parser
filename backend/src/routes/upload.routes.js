const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../config/multer');
const verifyToken = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// Rate limiting: 20 uploads per 15 minutes per IP
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many resume uploads from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/resume', verifyToken, uploadLimiter, upload.single('resume'), uploadController.uploadResume);

module.exports = router;
