const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, './images');
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = 'Image';
    const newFileName = `${fileName}-${Date.now()}${fileExtension}`;
    req.body.filename = newFileName;
    cb(null, newFileName);
  },
});
const upload = multer({
  storage,
  fileFilter: (res, file, cb) => {
    try {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
      } else {
        cb(null, false);
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    } catch (error) {
      res.stataus(400).json({
        status: false,
        message: 'Only .png, .jpg and .jpeg format allowed!',
      });
    }
  },
});
const UploadImage = upload.array('image');
const UploadProfileImage = upload.array('image');
module.exports = {
  UpdateGroupImage: UploadImage,
  UploadImage: UploadProfileImage,
};
