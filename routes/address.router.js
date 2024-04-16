const express = require('express');
const addressController = require('../controllers/address.controller');
const { verifyAdmin } = require('../middleware/admin.middleware');

const router = express.Router();

router.post('/address', verifyAdmin, addressController.add_address);
router.get('/address-view', verifyAdmin, addressController.view_address);
router.put('/address-edit/:id', verifyAdmin, addressController.edit_address);
router.delete('/delete-address/:id', verifyAdmin, addressController.delete_address);

module.exports = router;
