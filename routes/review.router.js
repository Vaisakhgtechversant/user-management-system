const express = require('express');
const reviewController = require('../controllers/review.controller');
const { verifyUser } = require('../middleware/user.middleware');

const router = express.Router();

router.post('/add_review/:id', verifyUser, reviewController.addProductReview);
router.put('/edit_review/:id', verifyUser, reviewController.editProductReview);
router.get('/get_review/:id', verifyUser, reviewController.getReview);

module.exports = router;
