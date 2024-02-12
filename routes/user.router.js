const express = require('express');
const userController = require('../controllers/user.controller');
const userAuthController = require('../controllers/userAuth.controller');

const { verifyUser } = require('../middleware/user.middleware');

const router = express.Router();
router.post('/loginuser', userController.login);
router.post('/add', verifyUser, userAuthController.addUser);
router.get('/get', verifyUser, userAuthController.getuser);
router.put('/update/:id', verifyUser, userAuthController.updateUser);
router.delete('/delete/:id', verifyUser, userAuthController.deleteUser);

module.exports = router;
