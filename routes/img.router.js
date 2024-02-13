const express = require('express');

const imgController = require('../controllers/img.controller');

const router = express.Router();
const UploadPost = require('../middleware/multer.middleware');

router.post('/upload', UploadPost.UploadImage, imgController.saveImg);

module.exports = router;
