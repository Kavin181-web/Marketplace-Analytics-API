const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

router.post('/', ordersController.createOrder);   // create a new order

router.get('/:id', ordersController.getOrderById); // get order by id 

router.get('/', ordersController.listOrders);  // get all orders

module.exports = router;
