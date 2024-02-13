const express = require('express');
const userController = require('../controllers/user.controller');
const userAuthController = require('../controllers/userAuth.controller');

const { verifyUser } = require('../middleware/user.middleware');

const router = express.Router();
router.post('/loginuser', userController.login);
router.get('/get', verifyUser, userAuthController.getuser);
router.get('/getone/:id', verifyUser, userAuthController.getone);
router.put('/update/:id', verifyUser, userAuthController.updateUser);
module.exports = router;
