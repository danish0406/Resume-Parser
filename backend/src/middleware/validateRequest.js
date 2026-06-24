const { formatError } = require('../utils/responseFormatter');

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json(formatError('Name, email, and password are required.'));
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json(formatError('Email and password are required.'));
  }
  next();
};

const validateJob = (req, res, next) => {
  const { title, company, description, required_skills } = req.body;
  if (!title || !company || !description || !required_skills) {
    return res.status(400).json(formatError('Title, company, description, and required_skills are required.'));
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateJob
};
