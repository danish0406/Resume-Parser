# Resume Intelligence & HR Analytics Platform

A premium Applicant Tracking System (ATS) SaaS application featuring automated resume text extraction, Claude AI structured parsing, quality scoring, semantic job description compatibility matching, talent search, and recruiter analytics.

---

## 📂 Project Structure

```
resume-parser/
├── frontend/                  # React + Tailwind CSS
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/            # Reusable: Button, Badge, Card, Modal, Spinner
│   │   │   ├── layout/        # Sidebar, Navbar, PageWrapper
│   │   │   ├── upload/        # DropZone, ParseProgress, FilePreview
│   │   │   ├── candidates/    # CandidateCard, CandidateTable, ScoreRing
│   │   │   ├── jobs/          # JobForm, MatchList, MatchScoreBar
│   │   │   └── analytics/     # SkillChart, StatsCard, TrendGraph
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Candidates.jsx
│   │   │   ├── CandidateDetail.jsx
│   │   │   ├── JobMatch.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Login.jsx
│   │   ├── hooks/             # useParse, useCandidates, useJobMatch
│   │   ├── context/           # AuthContext, ThemeContext
│   │   ├── services/          # api.js (axios instance + all API calls)
│   │   ├── utils/             # formatDate, scoreColor, truncate
│   │   ├── constants/         # colors.js, routes.js, categories.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                   # Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js          # MySQL connection pool using mysql2
│   │   │   └── multer.js      # Multer file upload setup (PDF/DOCX max 5MB)
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── candidateController.js
│   │   │   ├── uploadController.js
│   │   │   ├── jobController.js
│   │   │   └── analyticsController.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── candidate.routes.js
│   │   │   ├── upload.routes.js
│   │   │   ├── job.routes.js
│   │   │   └── analytics.routes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # JWT verification & credentials bypass
│   │   │   ├── errorHandler.js     # Unhandled error formatter
│   │   │   └── validateRequest.js  # Input payload validation
│   │   ├── services/
│   │   │   ├── parserService.js    # Extract text from PDF/DOCX
│   │   │   ├── claudeService.js    # Claude API structured parsing & Local NLP Fallback
│   │   │   ├── matchService.js     # JD vs Candidate scoring logic
│   │   │   └── scoreService.js     # Resume quality scoring
│   │   ├── utils/
│   │   │   ├── extractText.js
│   │   │   └── responseFormatter.js
│   │   └── app.js
│   ├── uploads/               # Temp resume storage
│   ├── .env
│   └── package.json
│
├── database/
│   ├── schema.sql             # Full table schema definitions
│   ├── seed.sql               # Seed recruiter user, candidates, and job matches
│   └── migrations/
│       ├── 001_create_users.sql
│       ├── 002_create_candidates.sql
│       ├── 003_create_skills.sql
│       ├── 004_create_experience.sql
│       ├── 005_create_education.sql
│       ├── 006_create_jobs.sql
│       └── 007_create_matches.sql
│
├── .gitignore
└── README.md
```

---

## 🛠️ Setup Instructions

### 1. Database Setup
Ensure you have MySQL server running on `localhost:3306`.
1. Login to your MySQL CLI:
   ```bash
   mysql -u root -p
   ```
2. Create the database:
   ```sql
   CREATE DATABASE resume_parser_db;
   ```
3. Initialize the schema and seed data by running the source scripts:
   ```sql
   source database/schema.sql;
   source database/seed.sql;
   ```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Configure `backend/.env` with your credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=resume_parser_db
   DB_PORT=3306
   JWT_SECRET=supersecretjwtkeyforresumeparserapp
   ANTHROPIC_API_KEY=your_claude_api_key (Optional: local NLP parser fallback active)
   CLAUDE_MODEL=claude-3-5-sonnet-20241022
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the dev server (running on port 3000):
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## ⚡ Key Environment Variables

### Backend (`backend/.env`)
- `PORT`: Port the Express server listens on (default: `5000`)
- `DB_HOST`: Hostname of the MySQL server (default: `localhost`)
- `DB_USER`: Username for MySQL connection (default: `root`)
- `DB_PASSWORD`: Password for MySQL connection (default: `danish@sql12345`)
- `DB_NAME`: Database schema name (default: `resume_parser_db`)
- `JWT_SECRET`: Secret key for JWT hashing signature
- `ANTHROPIC_API_KEY`: API Key for Claude structured parsing (leaving blank falls back to the local regex NLP engine)

---

## 🔌 API Endpoints Documentation

All response bodies follow the `{ success, data, message }` format.

### 🔐 Authentication
- `POST /api/auth/register` - Create recruiter profile (payload: `{ name, email, password }`)
- `POST /api/auth/login` - Verify password and generate token (payload: `{ email, password }`)
- `GET /api/auth/me` - Fetch profile detail of the authenticated user

### 👤 Candidates
- `GET /api/candidates` - Search and list candidates (optional queries: `search`, `status`, `skill`, `minScore`, `maxScore`)
- `GET /api/candidates/:id` - Fetch candidate details including experience, education, skills, and match reports
- `PATCH /api/candidates/:id/status` - Update review status tag (payload: `{ status: 'new' | 'shortlisted' | 'rejected' | 'interview' }`)
- `DELETE /api/candidates/:id` - Delete candidate profile and clear documents on disk

### 📤 Upload
- `POST /api/upload/resume` - Upload resume file, extract text, call Claude API parsed data, compute quality score, and save profile. (Form-data key: `resume` with PDF or DOCX file)

### 💼 Jobs & Match calculations
- `POST /api/jobs` - Create job listing and trigger matching for existing candidates (payload: `{ title, company, description, required_skills }`)
- `GET /api/jobs` - List all job postings
- `GET /api/jobs/:id/rankings` - Fetch candidate match compatibility rankings for a specific job
- `POST /api/jobs/match` - Recalculate job matches on-the-fly (payload: `{ candidateId, jobId }`)

### 📊 Recruiter Analytics
- `GET /api/analytics/dashboard` - Fetch stats cards tallies and recent uploads list
- `GET /api/analytics/skills` - Fetch top skills frequency distribution counts
- `GET /api/analytics/scores` - Fetch score distribution histogram datasets
- `GET /api/analytics/status` - Fetch candidate status pipeline breakdown tallies
- `GET /api/analytics/trends` - Fetch monthly resume uploads trend datasets

---

## 📸 Screenshots

*Placeholders for application dashboard screenshots*
- Recruiter Dashboard: `[Dashboard Mockup]`
- Resume Upload Zone & File Stepper: `[Upload Stepper]`
- Candidates Search Grid: `[Candidates Grid]`
- Job Compatibility Matches: `[Job Compatibility Detail Dialog]`
