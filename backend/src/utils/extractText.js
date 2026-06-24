const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');

const extractTextFromPdf = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

const extractTextFromDocx = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    throw new Error(`Failed to extract text from DOCX: ${error.message}`);
  }
};

const extractText = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.pdf') {
    return await extractTextFromPdf(filePath);
  } else if (ext === '.docx') {
    return await extractTextFromDocx(filePath);
  } else {
    throw new Error('Unsupported file extension. Only .pdf and .docx are supported.');
  }
};

module.exports = {
  extractText,
  extractTextFromPdf,
  extractTextFromDocx
};
