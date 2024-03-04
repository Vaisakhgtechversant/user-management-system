const express = require('express');
const adminCanController = require('../controllers/adminAuth.controller');
const { verifyUserRole } = require('../middleware/authGuard.middleware');
const { verifyAdmin } = require('../middleware/admin.middleware');

const router = express.Router();
router.get('/users', verifyUserRole, verifyAdmin, adminCanController.getuser);
router.get('/user/:id', verifyUserRole, verifyAdmin, adminCanController.getOne);

module.exports = router;
