const mongoose = require('mongoose'); 

const OrderSchema = new mongoose.Schema({      // creating order schema
  
  user: {                                 // reference to the user who placed the order
    type: mongoose.Schema.Types.ObjectId, // stores the user's id
    ref: 'User',                          // connects to User model
    required: true
  },

  vendor: {         // which vendor is processing the order
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },

  items: [          // list of items in the order
    {
      product: {      // which product was bought
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      qty: {
        type: Number,
        required: true,
        default: 1
      },
      priceAtPurchase: {    // product price at the time of purchase
        type: Number,
        required: true
      }
    }
  ],

  status: {               // order current status
    type: String,
    default: 'placed'
  },

  createdAt: {            // order created time
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);
