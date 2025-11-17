const express = require('express');  // importing express
const router = express.Router();     // creating router object

router.use('/users', require('./users'));   // using all route files
router.use('/vendors', require('./vendors'));
router.use('/products', require('./products'));
router.use('/orders', require('./orders'));
router.use('/payments', require('./payments')); 
router.use('/reviews', require('./reviews'));
router.use('/analytics', require('../analytics/analyticsRoutes'));

module.exports = router;
