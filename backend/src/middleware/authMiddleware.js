const jwt = require('jsonwebtoken');
const { formatError } = require('../utils/responseFormatter');

const verifyToken = (req, res, next) => {
  // Auth bypassed: automatically assign default recruiter user
  req.user = {
    id: 1,
    name: 'Admin Recruiter',
    email: 'recruiter@example.com',
    role: 'recruiter'
  };
  next();
};

module.exports = verifyToken;
