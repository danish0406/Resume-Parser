USE resume_parser_db;

-- 1. Insert Recruiter User (Password is 'password123')
INSERT INTO users (id, name, email, password_hash, role) 
VALUES (1, 'Admin Recruiter', 'recruiter@example.com', '$2a$10$hPryJ716Wl.z5eKkLd0RduW9t6M7iE8JtE/sC4tM3J22F5y1Vn5p2', 'recruiter')
ON DUPLICATE KEY UPDATE id=1;

-- 2. Insert Candidates
INSERT INTO candidates (id, user_id, name, email, phone, linkedin, github, location, summary, score, status, resume_path, raw_text)
VALUES 
(1, 1, 'John Smith', 'john.smith@example.com', '+1-555-0199', 'linkedin.com/in/johnsmith', 'github.com/johnsmith', 'San Francisco, CA', 'Experienced software engineer specialized in full-stack JavaScript development. Proven track record of building scalable web apps with React and Node.js.', 85, 'shortlisted', 'uploads/john_smith.pdf', 'John Smith\nSoftware Engineer\nEmail: john.smith@example.com\nPhone: +1-555-0199\nLinkedIn: linkedin.com/in/johnsmith\nGitHub: github.com/johnsmith\nLocation: San Francisco, CA\n\nSummary:\nExperienced software engineer specialized in full-stack JavaScript development. Proven track record of building scalable web apps with React and Node.js.\n\nSkills:\nJavaScript, React, Node.js, HTML, CSS, SQL, Git, AWS\n\nExperience:\nSenior Software Engineer at TechCorp (2022 - Present)\nBuilt SaaS platform scaling to 10k users.\n\nSoftware Engineer at StartupInc (2020 - 2022)\nDeveloped web applications using React.\n\nEducation:\nBS in Computer Science from Stanford University (2016 - 2020)'),
(2, 1, 'Priya Sharma', 'priya.sharma@example.com', '+91-9876543210', 'linkedin.com/in/priyasharma', 'github.com/priyasharma', 'Mumbai, India', 'Data analyst with 3+ years of experience in business intelligence, SQL query optimization, and dashboard creation using Power BI and Excel.', 70, 'new', 'uploads/priya_sharma.docx', 'Priya Sharma\nData Analyst\nEmail: priya.sharma@example.com\nPhone: +91-9876543210\nLinkedIn: linkedin.com/in/priyasharma\nGitHub: github.com/priyasharma\nLocation: Mumbai, India\n\nSummary:\nData analyst with 3+ years of experience in business intelligence, SQL query optimization, and dashboard creation using Power BI and Excel.\n\nSkills:\nSQL, Excel, Power BI, Python, Tableau, Statistics\n\nExperience:\nData Analyst at FinanceSolutions (2021 - Present)\nCreated financial dashboards and optimized ETL pipeline runtime by 30%.\n\nJunior Analyst at DataConsulting (2019 - 2021)\nManaged client database and wrote SQL reports.\n\nEducation:\nBachelor of Commerce from University of Mumbai (2015 - 2018)'),
(3, 1, 'Emily Chen', 'emily.chen@example.com', '+1-555-0234', 'linkedin.com/in/emilychen', 'github.com/emilychen', 'New York, NY', 'Product manager with a background in UI/UX design. Passionate about building user-centric tools and managing cross-functional development teams.', 92, 'interview', 'uploads/emily_chen.pdf', 'Emily Chen\nProduct Manager\nEmail: emily.chen@example.com\nPhone: +1-555-0234\nLinkedIn: linkedin.com/in/emilychen\n\nSummary:\nProduct manager with a background in UI/UX design. Passionate about building user-centric tools and managing cross-functional development teams.\n\nSkills:\nProduct Strategy, Roadmap, Wireframing, Agile, Scrum, Jira, Figma, Communication\n\nExperience:\nProduct Manager at InnovateTech (2022 - Present)\nLed product development of mobile apps.\n\nUX Designer at DesignStudio (2020 - 2022)\nCreated mockups and user flows.')
ON DUPLICATE KEY UPDATE id=id;

-- 3. Insert Skills
INSERT INTO skills (id, candidate_id, skill_name, category, proficiency)
VALUES
(1, 1, 'JavaScript', 'language', 90),
(2, 1, 'React', 'framework', 85),
(3, 1, 'Node.js', 'framework', 80),
(4, 1, 'SQL', 'language', 70),
(5, 1, 'AWS', 'tool', 65),
(6, 1, 'Git', 'tool', 90),
(7, 2, 'SQL', 'language', 95),
(8, 2, 'Excel', 'tool', 90),
(9, 2, 'Power BI', 'tool', 85),
(10, 2, 'Python', 'language', 60),
(11, 2, 'Tableau', 'tool', 75),
(12, 3, 'Product Strategy', 'soft', 90),
(13, 3, 'Figma', 'tool', 85),
(14, 3, 'Agile', 'soft', 95),
(15, 3, 'Jira', 'tool', 80),
(16, 3, 'Communication', 'soft', 95)
ON DUPLICATE KEY UPDATE id=id;

-- 4. Insert Experience
INSERT INTO experience (id, candidate_id, company, role, location, start_date, end_date, is_current, description)
VALUES
(1, 1, 'TechCorp', 'Senior Software Engineer', 'San Francisco, CA', '2022-06-01', NULL, 1, 'Built SaaS platform scaling to 10k users. Improved API latency by 40% and led team of 4 engineers.'),
(2, 1, 'StartupInc', 'Software Engineer', 'San Francisco, CA', '2020-07-01', '2022-05-31', 0, 'Developed web applications using React. Set up CI/CD pipeline and automated unit tests.'),
(3, 2, 'FinanceSolutions', 'Data Analyst', 'Mumbai, India', '2021-03-01', NULL, 1, 'Created financial dashboards and optimized ETL pipeline runtime by 30%. Provided weekly data insights to executives.'),
(4, 2, 'DataConsulting', 'Junior Analyst', 'Mumbai, India', '2019-06-01', '2021-02-28', 0, 'Managed client database and wrote SQL reports. Cleaned data sets for senior data scientists.'),
(5, 3, 'InnovateTech', 'Product Manager', 'New York, NY', '2022-03-01', NULL, 1, 'Led product development of mobile apps. Defined product roadmaps and aligned design/engineering teams.'),
(6, 3, 'DesignStudio', 'UX Designer', 'New York, NY', '2020-08-01', '2022-02-28', 0, 'Created mockups, wireframes, and user flows. Conducted user research interviews to improve usability.')
ON DUPLICATE KEY UPDATE id=id;

-- 5. Insert Education
INSERT INTO education (id, candidate_id, institution, degree, field, grade, start_year, end_year)
VALUES
(1, 1, 'Stanford University', 'Bachelor of Science', 'Computer Science', '3.8 GPA', 2016, 2020),
(2, 2, 'University of Mumbai', 'Bachelor of Commerce', 'Finance', 'First Class', 2015, 2018),
(3, 3, 'New York University', 'Bachelor of Fine Arts', 'Digital Design', '3.9 GPA', 2016, 2020)
ON DUPLICATE KEY UPDATE id=id;

-- 6. Insert Certifications
INSERT INTO certifications (id, candidate_id, title, issuer, issued_date, url)
VALUES
(1, 1, 'AWS Certified Solutions Architect', 'Amazon Web Services', '2023-01-15', 'https://aws.amazon.com/verification'),
(2, 2, 'Microsoft Certified: Power BI Data Analyst Associate', 'Microsoft', '2022-09-10', ''),
(3, 3, 'Certified Scrum Product Owner (CSPO)', 'Scrum Alliance', '2022-05-20', '')
ON DUPLICATE KEY UPDATE id=id;

-- 7. Insert Job Descriptions
INSERT INTO job_descriptions (id, user_id, title, company, description, required_skills)
VALUES
(1, 1, 'Full Stack Engineer', 'SaaS Corp', 'We are looking for a Full Stack Engineer experienced with React and Node.js. Experience with AWS is a plus.', 'React,Node.js,JavaScript,SQL,AWS,Git'),
(2, 1, 'Business / Data Analyst', 'FinanceHub', 'Looking for an analyst who is expert at SQL, Excel, and Power BI dashboards.', 'SQL,Excel,Power BI,Tableau,Python')
ON DUPLICATE KEY UPDATE id=id;

-- 8. Insert Matches
INSERT INTO matches (id, job_id, candidate_id, match_score, matched_skills, missing_skills)
VALUES
(1, 1, 1, 95, 'React,Node.js,JavaScript,SQL,AWS,Git', ''),
(2, 1, 2, 35, 'SQL', 'React,Node.js,JavaScript,AWS,Git'),
(3, 2, 1, 40, 'SQL', 'Excel,Power BI,Tableau,Python'),
(4, 2, 2, 90, 'SQL,Excel,Power BI,Tableau,Python', '')
ON DUPLICATE KEY UPDATE id=id;
