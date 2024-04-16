const express = require('express');
const loginController = require('../controllers/login.controller');
const orderController = require('../controllers/order.controller');
const userAuthController = require('../controllers/userAuth.controller');
const { verifyUserRole } = require('../middleware/authGuard.middleware');
const { verifyAdmin } = require('../middleware/admin.middleware');

const UploadPost = require('../middleware/multer.middleware');

const router = express.Router();
router.post('/login', loginController.login);
router.post('/add', userAuthController.addNewUser);
router.get('/me', verifyUserRole, verifyAdmin, userAuthController.getone);
router.get('/mee', verifyUserRole, verifyAdmin, userAuthController.getAggreone);

router.put('/me/update-user', verifyUserRole, verifyAdmin, UploadPost.userUploadImage, userAuthController.updateUser);
router.put('/me/update-password', verifyUserRole, verifyAdmin, userAuthController.updatePassword);
router.post('/me/forgotpassword', userAuthController.sendOtp);
router.post('/me/verifyotp', userAuthController.verifyotp);
router.post('/me/changepassword', userAuthController.changepassword);

router.post('/add-to-cart/:productId', verifyAdmin, userAuthController.addToCart);
router.post('/add-to-wishlist/:productId', verifyAdmin, userAuthController.addToWishlist);

router.get('/cart', verifyAdmin, userAuthController.getCartItems);
router.get('/cart/:id', verifyAdmin, userAuthController.get_singleCart);

router.put('/update-cart/:id', verifyAdmin, userAuthController.edit_cart);

router.get('/wishlist', verifyAdmin, userAuthController.getWishlist);
router.delete('/delete-cart/:id', verifyAdmin, userAuthController.deleteCart);
router.delete('/delete-wishist/:id', verifyAdmin, userAuthController.deleteWishlist);
router.post('/order', verifyAdmin, orderController.orderProduct);
router.post('/orderSingle/:id', verifyAdmin, orderController.orderSingleProduct);
router.get('/my-order-single/:id', verifyAdmin, orderController.my_order_single);
router.get('/order-productlist', verifyAdmin, orderController.order_product_list);

module.exports = router;
