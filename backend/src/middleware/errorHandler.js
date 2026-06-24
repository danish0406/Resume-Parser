const { formatError } = require('../utils/responseFormatter');

const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);
  
  // Handle multer specific errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json(formatError('File size is too large. Max size is 5MB.'));
  }
  
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json(formatError(message));
};

module.exports = errorHandler;
