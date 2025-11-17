const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

router.post('/', reviewsController.createReview);  // create a new review

router.get('/product/:productId', reviewsController.getReviewsByProduct);  // get all reviews for a specific product

router.get('/', reviewsController.listReviews);  // list recent reviews (simple)

module.exports = router;
