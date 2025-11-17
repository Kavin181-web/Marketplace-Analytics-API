const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');

router.post('/create', paymentsController.createPayment);  // create payment (pending status)

router.post('/webhook', paymentsController.handleGatewayCallback);  // gateway callback to update payment status

router.get('/:id', async (req, res) => {    // get payment by id
  try {
    const Payment = require('../models/payment');
    const payment = await payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Not found' });
    return res.json(payment);   // send payment details
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
