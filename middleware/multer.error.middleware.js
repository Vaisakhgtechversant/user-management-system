const multer = require('multer');
const createHttpError = require('http-errors');

module.exports = (err, req, res, next) => {
  try {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        throw createHttpError.ExpectationFailed(
          'only one image is allowed per field',
        );
      } else throw createHttpError.ExpectationFailed('Expected field not found');
    }
  } catch (error) {
    next(error);
  }
};
