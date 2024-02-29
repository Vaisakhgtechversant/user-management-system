const express = require('express');

const imgController = require('../controllers/img.controller');
const multerError = require('../middleware/multer.error.middleware');

const router = express.Router();
const UploadPost = require('../middleware/multer.middleware');

router.post('/import', UploadPost.UploadImage, imgController.saveBlog, multerError);
router.get('/export/:filename', imgController.getimage);
module.exports = router;
