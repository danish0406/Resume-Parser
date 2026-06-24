CREATE DATABASE IF NOT EXISTS resume_parser_db;
USE resume_parser_db;

-- Drop tables in dependency order (including old match_scores)
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS match_scores;
DROP TABLE IF EXISTS job_descriptions;
DROP TABLE IF EXISTS certifications;
DROP TABLE IF EXISTS education;
DROP TABLE IF EXISTS experience;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS users;

-- Create Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'recruiter',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Candidates table
CREATE TABLE candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    location VARCHAR(150),
    summary TEXT,
    score INT DEFAULT 0,
    status ENUM('new', 'shortlisted', 'rejected', 'interview') DEFAULT 'new',
    resume_path VARCHAR(255),
    raw_text LONGTEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Skills table
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    category ENUM('language', 'framework', 'tool', 'soft', 'other') DEFAULT 'other',
    proficiency INT DEFAULT 0,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- Create Experience table
CREATE TABLE experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    company VARCHAR(150) NOT NULL,
    role VARCHAR(100) NOT NULL,
    location VARCHAR(150),
    start_date DATE,
    end_date DATE,
    is_current TINYINT(1) DEFAULT 0,
    description TEXT,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- Create Education table
CREATE TABLE education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    institution VARCHAR(150) NOT NULL,
    degree VARCHAR(100),
    field VARCHAR(100),
    grade VARCHAR(20),
    start_year INT,
    end_year INT,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- Create Certifications table
CREATE TABLE certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    issuer VARCHAR(150),
    issued_date DATE,
    url VARCHAR(255),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- Create Job Descriptions table
CREATE TABLE job_descriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    description TEXT,
    required_skills TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Matches table
CREATE TABLE matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    candidate_id INT NOT NULL,
    match_score INT DEFAULT 0,
    matched_skills TEXT,
    missing_skills TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES job_descriptions(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);
