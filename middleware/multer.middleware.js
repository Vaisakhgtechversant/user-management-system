const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

const UploadImage = upload.single('image');

module.exports = {
  UploadImage,
};
