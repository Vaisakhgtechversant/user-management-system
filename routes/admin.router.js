const express = require('express');
const adminController = require('../controllers/admin.controller');
const adminCanController = require('../controllers/adminAuth.controller');
const { verifyAdmin } = require('../middleware/admin.middleware');

const router = express.Router();
router.post('/login', adminController.login);
router.post('/addUser', verifyAdmin, adminCanController.addUser);
router.get('/users', verifyAdmin, adminCanController.getuser);
router.put('/update/:id', verifyAdmin, adminCanController.updateUser);
router.delete('/delete/:id', verifyAdmin, adminCanController.deleteUser);

// Refresh Token
router.post('/refresh-token', adminController.refreshtoken);
module.exports = router;
