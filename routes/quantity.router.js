const express = require('express');
const quantityController = require('../controllers/quantity.controller');
const { verifyUser } = require('../middleware/user.middleware');

const UploadPost = require('../middleware/multer.middleware');

const router = express.Router();

router.post('/add_qty', verifyUser, UploadPost.UploadImage, quantityController.add_qty);
router.get('/get_qty', verifyUser, quantityController.get_quantity);
router.put('/edit_qty/:id', verifyUser, quantityController.edit_quantity);

module.exports = router;
