const { extractText } = require('../utils/extractText');

const parseResumeText = async (filePath) => {
  return await extractText(filePath);
};

module.exports = {
  parseResumeText
};
