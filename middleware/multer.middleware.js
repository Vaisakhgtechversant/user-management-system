const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
  limits: {
    files: 2, // Limiting to two files
  },
});
const errorHandler = (err, req, res) => {
  res.status(400).json({ error: err.message });
};

const handleUpload = (fieldName) => (req, res, next) => {
  upload.array(fieldName)(req, res, (err) => {
    if (err) {
      errorHandler(err, req, res, next);
    }
    next();
  });
};

const UploadImage = handleUpload('image');

module.exports = {
  UploadImage,
};
