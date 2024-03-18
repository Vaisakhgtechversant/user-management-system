const express = require('express');
const adminProduct = require('../controllers/adminProdt.controller');
const { verifyUserRole } = require('../middleware/authGuard.middleware');
const { verifyAdmin } = require('../middleware/admin.middleware');
const UploadPost = require('../middleware/multer.middleware');

const router = express.Router();

router.post('/addProdt', verifyUserRole, verifyAdmin, UploadPost.UploadImage, adminProduct.addProduct);
router.get('/getProdt', verifyUserRole, verifyAdmin, adminProduct.getProduct);
router.put('/updateProdt/:id', verifyUserRole, verifyAdmin, UploadPost.UploadImage, adminProduct.updateProduct);

module.exports = router;
