CREATE TABLE IF NOT EXISTS education (
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

CREATE TABLE IF NOT EXISTS certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    issuer VARCHAR(150),
    issued_date DATE,
    url VARCHAR(255),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);
