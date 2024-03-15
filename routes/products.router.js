const express = require('express');
const adminProduct = require('../controllers/adminProdt.controller');
const { verifyUserRole } = require('../middleware/authGuard.middleware');
const { verifyAdmin } = require('../middleware/admin.middleware');

const router = express.Router();

router.post('/addProdt', verifyUserRole, verifyAdmin, adminProduct.addProduct);
router.get('/getProdt', verifyUserRole, verifyAdmin, adminProduct.getProduct);

module.exports = router;
