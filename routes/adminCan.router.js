const express = require('express');
const adminCanController = require('../controllers/adminCan.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

const router = express.Router();
router.post('/addUser', verifyAdmin, adminCanController.addUser);
router.get('/getUser', verifyAdmin, adminCanController.getuser);
router.put('/update/:id', verifyAdmin, adminCanController.updateUser);
router.delete('/delete/:id', verifyAdmin, adminCanController.deleteUser);

module.exports = router;
