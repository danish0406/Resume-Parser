CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    category ENUM('language', 'framework', 'tool', 'soft', 'other') DEFAULT 'other',
    proficiency INT DEFAULT 0,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);
