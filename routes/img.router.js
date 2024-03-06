const express = require('express');

const imgController = require('../controllers/img.controller');
const { verifyUserRole } = require('../middleware/authGuard.middleware');
const { verifyUser } = require('../middleware/user.middleware');

const router = express.Router();
const UploadPost = require('../middleware/multer.middleware');

router.post('/import', verifyUserRole, verifyUser, UploadPost.UploadImage, imgController.saveBlog);
router.get('/export/:filename', imgController.getimage);
module.exports = router;
