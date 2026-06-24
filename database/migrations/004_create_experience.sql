CREATE TABLE IF NOT EXISTS experience (
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
