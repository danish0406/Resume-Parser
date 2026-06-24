const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { formatSuccess, formatError } = require('../utils/responseFormatter');

const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  try {
    // Check if user already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json(formatError('Email is already registered.'));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userRole = role || 'recruiter';

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, userRole]
    );

    const token = jwt.sign(
      { id: result.insertId, name, email, role: userRole },
      process.env.JWT_SECRET || 'supersecretjwtkeyforresumeparserapp',
      { expiresIn: '24h' }
    );

    res.status(201).json(formatSuccess({
      token,
      user: { id: result.insertId, name, email, role: userRole }
    }, 'User registered successfully.'));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json(formatError('Invalid email or password.'));
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json(formatError('Invalid email or password.'));
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'supersecretjwtkeyforresumeparserapp',
      { expiresIn: '24h' }
    );

    res.json(formatSuccess({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    }, 'Login successful.'));
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json(formatError('User not found.'));
    }
    res.json(formatSuccess(users[0]));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
