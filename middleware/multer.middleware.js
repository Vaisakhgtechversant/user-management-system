const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

const storage = multer.diskStorage({
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
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

const resizeImage = async (req, res, next) => {
  if (!req.files || !req.files.length) {
    next();
  }

  try {
    const resizePromises = req.files.map(async (file) => {
      const resizedImageBuffer = await sharp(file.path)
        .resize(200, 200, { fit: 'inside' })
        .toBuffer();
      console.log('resize');
      const updatedFile = {
        ...file,
        buffer: resizedImageBuffer,
      };
      const index = req.files.indexOf(file);
      req.files[index] = updatedFile;
    });
    await Promise.all(resizePromises);
    next();
  } catch (error) {
    next(error);
  }
};
const UploadImage = upload.array('image');

module.exports = {
  UploadImage, resizeImage,
};
