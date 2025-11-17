const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({   // creating review schema
  user: {                               
    type: mongoose.Schema.Types.ObjectId,    // which user gave the review
    ref: 'User',
    required: true
  },

  product: {                                 // which product is reviewed
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },

  rating: {                             // rating value
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  comment: {                           // review message
    type: String,
    default: ''
  }
}, {
  timestamps: true                       // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Review', ReviewSchema);
