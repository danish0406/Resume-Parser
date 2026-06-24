const formatSuccess = (data, message = 'Success') => {
  return {
    success: true,
    data: data,
    message: message
  };
};

const formatError = (message = 'Error occurred', data = null) => {
  return {
    success: false,
    data: data,
    message: message
  };
};

module.exports = {
  formatSuccess,
  formatError
};
