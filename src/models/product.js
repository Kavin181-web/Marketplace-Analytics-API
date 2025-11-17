const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({    // creating product schema
  
  name: {               // product name
    type: String,
    required: true
  },

  category: {          // category of the product (like food, clothes etc)
    type: String,
    required: true
  },

  price: {             // price of the product
    type: Number,
    required: true
  },

  vendor: {              // vendor id (who owns this product)
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor',                        // connects this field to Vendor model
    required: true
  },

  stock: {               // how many products are in stock
    type: Number,
    default: 0
  }
});

ProductSchema.virtual('reviews', {    // virtual relation for reviews
  ref: 'Review',           // review model
  localField: '_id',       // product _id
  foreignField: 'product', // match review.product
  justOne: false           // many reviews, not one
});

ProductSchema.set('toObject', { virtuals: true });   // To show virtual fields (reviews) in JSON output
ProductSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', ProductSchema);
