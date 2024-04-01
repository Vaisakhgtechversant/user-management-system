const express = require('express');
const addressController = require('../controllers/address.controller');
const { verifyUser } = require('../middleware/user.middleware');

const router = express.Router();

router.post('/address', verifyUser, addressController.add_address);

module.exports = router;
