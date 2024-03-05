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
router.put('/me/update-user', verifyUserRole, verifyUser, UploadPost.UploadImage, userAuthController.updateUser);
router.put('/me/update-password', verifyUserRole, verifyUser, userAuthController.updatePassword);
router.post('/me/forgotpassword', userAuthController.sendOtp);
router.post('/me/verifyotp', userAuthController.verifyotp);
router.post('/me/changepassword', verifyUser, userAuthController.changepassword);
module.exports = router;
