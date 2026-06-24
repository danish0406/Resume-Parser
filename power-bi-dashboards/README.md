# Power BI Dashboards Integration Guide

This guide details the step-by-step instructions, SQL queries, and data model setup required to connect your local MySQL database (`resume_parser_db`) to Microsoft Power BI and build the three recruiter intelligence dashboards.

---

## 1. Database Connection & Schema Relationships

### Connection Details:
- **Connector**: MySQL Database (Requires installing the MySQL Connector/NET on your Windows machine).
- **Server**: `localhost:3306`
- **Database**: `resume_parser_db`
- **Credentials**: Database username and password (e.g. `root`/`password`).

### Data Model Schema (Star Schema):
Configure relationships in the **Power BI Model View**:
1. **`candidates` (1)** ─── **`skills` (Many)** (linked via `candidate_id`, Active, Cascade delete/filter direction: Single)
2. **`candidates` (1)** ─── **`education` (Many)** (linked via `candidate_id`, Active, filter: Single)
3. **`candidates` (1)** ─── **`experience` (Many)** (linked via `candidate_id`, Active, filter: Single)
4. **`candidates` (1)** ─── **`match_scores` (Many)** (linked via `candidate_id`, Active, filter: Both)
5. **`job_descriptions` (1)** ─── **`match_scores` (Many)** (linked via `jd_id`, Active, filter: Both)

---

## 2. Dashboard Configurations & SQL Queries

### REPORT 1: Recruitment Overview (`recruitment-overview.pbix`)
*Focuses on global candidate statistics, talent pool education, and core skills distribution.*

#### A. Metric Cards (KPIs):
1. **Total Candidates**:
   - *DAX*: `Total Candidates = COUNT(candidates[candidate_id])`
2. **Average Match Score**:
   - *DAX*: `Avg Match Score = AVERAGE(match_scores[match_percentage])`
3. **Top Skill**:
   - *SQL Dataset Query*:
     ```sql
     SELECT skill_name, COUNT(*) as count 
     FROM skills 
     GROUP BY skill_name 
     ORDER BY count DESC 
     LIMIT 1;
     ```
4. **Most Common Degree**:
   - *SQL Dataset Query*:
     ```sql
     SELECT degree, COUNT(*) as count 
     FROM education 
     GROUP BY degree 
     ORDER BY count DESC 
     LIMIT 1;
     ```

#### B. Pie Chart: Education Distribution
- **Visual**: Pie / Donut Chart
- **Legend / Details**: `education[degree]`
- **Values**: `COUNT(education[education_id])`
- **Goal**: Highlight splits of degrees (B.Tech, MBA, BCA, MCA, BSc, MSc).

#### C. Bar Chart: Skill Distribution
- **Visual**: Vertical Bar Chart
- **Axis (X-axis)**: `skills[skill_name]`
- **Values**: `COUNT(skills[skill_id])`
- **Goal**: List overall talent pool skills counts (Python, SQL, Excel, Power BI).

---

### REPORT 2: Candidate Pipeline (`candidate-pipeline.pbix`)
*Visualizes recruitment conversion rates and pipeline volume from application to selection based on match percentage thresholds.*

#### A. Funnel Chart: Recruitment Funnel
Create a custom SQL query to feed the funnel dataset:
```sql
SELECT 
    'Applied' AS Stage,
    COUNT(DISTINCT candidate_id) AS Volume,
    1 AS OrderKey
FROM candidates

UNION ALL

SELECT 
    'Shortlisted (Match >= 60%)' AS Stage,
    COUNT(DISTINCT candidate_id) AS Volume,
    2 AS OrderKey
FROM match_scores
WHERE match_percentage >= 60.0

UNION ALL

SELECT 
    'Interviewed (Match >= 75%)' AS Stage,
    COUNT(DISTINCT candidate_id) AS Volume,
    3 AS OrderKey
FROM match_scores
WHERE match_percentage >= 75.0

UNION ALL

SELECT 
    'Selected (Match >= 85%)' AS Stage,
    COUNT(DISTINCT candidate_id) AS Volume,
    4 AS OrderKey
FROM match_scores
WHERE match_percentage >= 85.0
ORDER BY OrderKey;
```
- **Visual**: Funnel Chart
- **Group**: `Stage`
- **Values**: `Volume`
- **Sort By**: `OrderKey` ascending

#### B. Conversion Rate Cards:
Calculate rates using DAX:
1. **Applied to Shortlisted**:
   - `AppToShortlistRate = DIVIDE(CALCULATE(COUNT(match_scores[candidate_id]), match_scores[match_percentage] >= 60), COUNT(candidates[candidate_id]), 0)`
2. **Shortlisted to Interviewed**:
   - `ShortlistToInterviewRate = DIVIDE(CALCULATE(COUNT(match_scores[candidate_id]), match_scores[match_percentage] >= 75), CALCULATE(COUNT(match_scores[candidate_id]), match_scores[match_percentage] >= 60), 0)`
3. **Interviewed to Selected**:
   - `InterviewToSelectedRate = DIVIDE(CALCULATE(COUNT(match_scores[candidate_id]), match_scores[match_percentage] >= 85), CALCULATE(COUNT(match_scores[candidate_id]), match_scores[match_percentage] >= 75), 0)`

---

### REPORT 3: Skill Gap Dashboard (`skill-gap-dashboard.pbix`)
*Assists recruiters in identifying specific technical skills missing from the candidate pool.*

#### A. Horizontal Bar Chart: Most Missing Skills
We need to split the comma-separated `skill_gap` column in Power Query or use SQL:
- *SQL Dataset Query (Splits comma-delimited strings to rows)*:
  ```sql
  SELECT 
      TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(ms.skill_gap, ',', n.n), ',', -1)) AS MissingSkill,
      COUNT(*) AS Count
  FROM match_scores ms
  INNER JOIN (
      SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
      UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8
  ) n ON CHAR_LENGTH(ms.skill_gap) - CHAR_LENGTH(REPLACE(ms.skill_gap, ',', '')) >= n.n - 1
  WHERE ms.skill_gap IS NOT NULL AND ms.skill_gap <> ''
  GROUP BY MissingSkill
  ORDER BY Count DESC;
  ```
- **Visual**: Horizontal Bar Chart
- **Y-Axis**: `MissingSkill`
- **X-Axis**: `Count`

#### B. Table: Candidate Gaps Matrix
- **Visual**: Table / Matrix
- **Columns**: 
  - `candidates[candidate_id]`
  - `candidates[name]`
  - `match_scores[skill_gap]` (renamed as *Missing Skills*)
  - `match_scores[match_percentage]` (formatted as percentage)
- **Goal**: Direct view for recruiters of what skills each candidate is missing for the active JDs.
