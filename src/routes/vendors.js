const express = require('express');
const router = express.Router();
const vendorsController = require('../controllers/vendorsController');

router.post('/', vendorsController.createVendor);   // create vendor

router.get('/', vendorsController.getAllVendors);   // get all vendors
router.get('/:id', vendorsController.getVendorById); // get vendor by id

module.exports = router;
