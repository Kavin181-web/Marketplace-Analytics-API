const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({    // creating payment schema
  order: {
    type: mongoose.Schema.Types.ObjectId,       // which order this payment belongs to
    ref: 'Order',
    required: true,          
  },
  amount: {
    type: Number,
    required: true,            // payment amount
  },
  method: {
    type: String,
    required: true,           // payment method (card, upi, cash etc)
  },
  
  status: {                // we start as 'pending' because we wait for gateway result
    type: String,
    enum: ['pending', 'success', 'failed'],   // only these values allowed
    default: 'pending'
  },
  
  paidAt: {               // set when payment actually completes successfully
    type: Date
  },
  createdAt: {           // created time
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);
