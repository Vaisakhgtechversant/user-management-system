exports.handleError = (res, errorMessage = 'internal server error', statusCode = 500) => {
  console.log(errorMessage);
  return res.status(statusCode).json({
    status: 'false',
    message: errorMessage,
  });
};
