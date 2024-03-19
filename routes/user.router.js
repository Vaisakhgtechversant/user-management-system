const express = require('express');
const loginController = require('../controllers/login.controller');
const userAuthController = require('../controllers/userAuth.controller');
const { verifyUserRole } = require('../middleware/authGuard.middleware');
const { verifyUser } = require('../middleware/user.middleware');
const UploadPost = require('../middleware/multer.middleware');

const router = express.Router();
router.post('/login', loginController.login);
router.post('/add', userAuthController.addNewUser);
router.get('/me', verifyUserRole, verifyUser, userAuthController.getone);
router.get('/mee', verifyUserRole, verifyUser, userAuthController.getAggreone);

router.put('/me/update-user', verifyUserRole, verifyUser, UploadPost.UploadImage, userAuthController.updateUser);
router.put('/me/update-password', verifyUserRole, verifyUser, userAuthController.updatePassword);
router.post('/me/forgotpassword', userAuthController.sendOtp);
router.post('/me/verifyotp', userAuthController.verifyotp);
router.post('/me/changepassword', userAuthController.changepassword);

router.post('/add-to-cart/:productId', verifyUser, userAuthController.addToCart);
router.post('/add-to-wishlist/:productId', verifyUser, userAuthController.addToWishlist);
router.get('/cart', verifyUser, userAuthController.getCartItems);
// router.delete('/delete-cart/:id', verifyUser, userAuthController.deleteCart);
module.exports = router;
