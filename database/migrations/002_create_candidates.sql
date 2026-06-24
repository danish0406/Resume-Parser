CREATE TABLE IF NOT EXISTS candidates (
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
