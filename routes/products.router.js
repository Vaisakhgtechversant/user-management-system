const express = require('express');
const adminProduct = require('../controllers/adminProdt.controller');
const { verifyUserRole } = require('../middleware/authGuard.middleware');
const { verifyAdmin } = require('../middleware/admin.middleware');
const UploadPost = require('../middleware/multer.middleware');

const router = express.Router();

router.post('/addProdt', verifyUserRole, verifyAdmin, UploadPost.UploadImage, adminProduct.addProduct);
router.get('/getProdt', verifyAdmin, adminProduct.getProduct);
router.get('/get-one/:id', verifyAdmin, adminProduct.singleProduct);
router.put('/updateProdt/:id', verifyUserRole, verifyAdmin, UploadPost.UploadImage, adminProduct.updateProduct);

module.exports = router;
