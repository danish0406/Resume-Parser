const claudeService = require('./claudeService');

const calculateScore = async (candidateData) => {
  return await claudeService.getResumeScore(candidateData);
};

module.exports = {
  calculateScore
};
