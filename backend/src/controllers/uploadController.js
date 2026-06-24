const path = require('path');
const fs = require('fs');
const pool = require('../config/db');
const parserService = require('../services/parserService');
const claudeService = require('../services/claudeService');
const { formatSuccess, formatError } = require('../utils/responseFormatter');

const uploadResume = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json(formatError('No file uploaded. Please upload a PDF or DOCX file.'));
  }

  const filePath = req.file.path;
  const relativePath = `uploads/${path.basename(filePath)}`;
  const userId = req.user.id;

  try {
    // 1. Extract raw text from document
    const rawText = await parserService.parseResumeText(filePath);

    // 2. Extract structured profile using Claude (or fallback)
    const profile = await claudeService.parseResumeText(rawText);

    // 3. Compute resume quality score
    const evaluation = await claudeService.getResumeScore(profile);

    // 4. Save Candidate Profile in Transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert Candidate
      const [candResult] = await connection.query(
        `INSERT INTO candidates (
          user_id, name, email, phone, linkedin, github, location, summary, score, status, resume_path, raw_text
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          profile.name || 'Unknown',
          profile.email,
          profile.phone,
          profile.linkedin,
          profile.github,
          profile.location,
          profile.summary,
          evaluation.score || 0,
          'new',
          relativePath,
          rawText
        ]
      );

      const candidateId = candResult.insertId;

      // Insert Skills
      if (profile.skills && Array.isArray(profile.skills)) {
        for (const skill of profile.skills) {
          await connection.query(
            `INSERT INTO skills (candidate_id, skill_name, category, proficiency) VALUES (?, ?, ?, ?)`,
            [
              candidateId,
              skill.skill_name || skill,
              skill.category || 'other',
              skill.proficiency || 0
            ]
          );
        }
      }

      // Insert Experience
      if (profile.experience && Array.isArray(profile.experience)) {
        for (const exp of profile.experience) {
          let startDate = exp.start_date ? new Date(exp.start_date) : null;
          let endDate = exp.end_date ? new Date(exp.end_date) : null;
          
          if (isNaN(startDate)) startDate = null;
          if (isNaN(endDate)) endDate = null;

          await connection.query(
            `INSERT INTO experience (
              candidate_id, company, role, location, start_date, end_date, is_current, description
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              candidateId,
              exp.company || 'Unknown Company',
              exp.role || 'Unknown Role',
              exp.location,
              startDate,
              endDate,
              exp.is_current ? 1 : 0,
              exp.description
            ]
          );
        }
      }

      // Insert Education
      if (profile.education && Array.isArray(profile.education)) {
        for (const edu of profile.education) {
          await connection.query(
            `INSERT INTO education (
              candidate_id, institution, degree, field, grade, start_year, end_year
             ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              candidateId,
              edu.institution || 'Unknown Institution',
              edu.degree,
              edu.field,
              edu.grade,
              edu.start_year,
              edu.end_year
            ]
          );
        }
      }

      // Insert Certifications
      if (profile.certifications && Array.isArray(profile.certifications)) {
        for (const cert of profile.certifications) {
          let issuedDate = cert.issued_date ? new Date(cert.issued_date) : null;
          if (isNaN(issuedDate)) issuedDate = null;

          await connection.query(
            `INSERT INTO certifications (
              candidate_id, title, issuer, issued_date, url
             ) VALUES (?, ?, ?, ?, ?)`,
            [
              candidateId,
              cert.title || 'Unknown Certificate',
              cert.issuer,
              issuedDate,
              cert.url
            ]
          );
        }
      }

      await connection.commit();
      connection.release();

      res.status(201).json(formatSuccess({
        id: candidateId,
        name: profile.name,
        score: evaluation.score,
        reasoning: evaluation.reasoning,
        profile
      }, 'Resume uploaded and parsed successfully.'));

    } catch (dbError) {
      await connection.rollback();
      connection.release();
      throw dbError;
    }

  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    next(error);
  }
};

module.exports = {
  uploadResume
};
