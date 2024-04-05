const express = require('express');
const addressController = require('../controllers/address.controller');
const { verifyUser } = require('../middleware/user.middleware');

const router = express.Router();

router.post('/address', verifyUser, addressController.add_address);
router.get('/address-view', verifyUser, addressController.view_address);
router.put('/address-edit/:id', verifyUser, addressController.edit_address);
router.delete('/delete-address/:id', verifyUser, addressController.delete_address);

module.exports = router;
