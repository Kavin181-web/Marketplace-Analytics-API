const express = require('express');
const router = express.Router();


const analytics = require('./analyticsController');  // importing all analytics functions

// main analytics routes
router.get('/overview', analytics.overview);                 // overview stats
router.get('/summary', analytics.overview);         
router.get('/top-vendors', analytics.topVendors);            // top vendors by GMV
router.get('/top-products', analytics.topProducts);          // top selling products
router.get('/category-stats', analytics.categoryStats);      // revenue + product count per category
router.get('/vendor-rating/:vendorId', analytics.vendorRating); // rating of a single vendor
router.get('/revenue-trend', analytics.revenueTrend);        // weekly revenue for last 12 weeks


module.exports = router;
