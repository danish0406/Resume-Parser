const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'resume_parser_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection on startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database pool.');
    connection.release();
  } catch (error) {
    console.error('Failed to connect to MySQL database:', error.message);
  }
})();

module.exports = pool;
