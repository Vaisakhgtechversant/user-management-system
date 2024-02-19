const express = require('express');
const userController = require('../controllers/user.controller');
const userAuthController = require('../controllers/userAuth.controller');
const { verifyUserRole } = require('../middleware/authGuard.middleware');
const { verifyUser } = require('../middleware/user.middleware');

const router = express.Router();
router.post('/login', userController.login);
router.get('/get/:id', verifyUserRole, verifyUser, userAuthController.getone);
router.put('/update/:id', verifyUserRole, verifyUser, userAuthController.updateUser);
router.put('/update-password/:id', verifyUserRole, verifyUser, userAuthController.updatePassword);
module.exports = router;
