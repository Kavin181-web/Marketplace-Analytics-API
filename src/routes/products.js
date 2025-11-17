const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

router.post('/', productsController.createProduct);  // create product

router.get('/', productsController.getAllProducts);  // get all products

router.get('/:id', productsController.getProductById);  // get product by id

module.exports = router;
