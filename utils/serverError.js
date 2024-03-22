exports.handleError = (res, errorMessage = 'internal server errorr', statusCode = 500) => {
  console.log(errorMessage);
  return res.status(statusCode).json({
    status: 'false',
    message: errorMessage,
  });
};
