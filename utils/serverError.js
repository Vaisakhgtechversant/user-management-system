exports.handleError = (res, errorMessage = 'server error', statusCode = 500) => {
  console.log(errorMessage);
  return res.status(statusCode).json({
    status: 'false',
    message: errorMessage,
  });
};
