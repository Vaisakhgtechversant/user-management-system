const express = require('express');
const reviewController = require('../controllers/review.controller');
const { verifyAdmin } = require('../middleware/admin.middleware');

const router = express.Router();

router.post('/add_review/:id', verifyAdmin, reviewController.addProductReview);
router.put('/edit_review/:id', verifyAdmin, reviewController.editProductReview);
router.get('/get_review/:id', verifyAdmin, reviewController.getReview);

module.exports = router;
