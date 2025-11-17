const Review = require('../models/review');
const Product = require('../models/product');
const Vendor = require('../models/vendor');

exports.createReview = async (req, res) => {  // create review + update vendor rating
  try {
    const { user, product, rating, comment } = req.body;  // taking data

    if (!user || !product || rating == null) {   // checking required fields
      return res.status(400).json({ error: 'user, product and rating are required' });
    }

    const review = await Review.create({   // save review
      user,   
      product,
      rating,
      comment
    });

    
    const productData = await Product.findById(product);  // find product to get vendor id
    if (productData) {
      const vendorId = productData.vendor;

      
      const productsOfVendor = await Product.find({ vendor: vendorId });  // get all products of this vendor

      
      const productIds = productsOfVendor.map(p => p._id); // collect vendor product ids

      const reviews = await Review.find({ product: { $in: productIds } });  // get all reviews of these products

      
      let total = 0;  // calculate average rating manually
      reviews.forEach(r => {
        total = total + r.rating;
      });

      let avg = 0;
      if (reviews.length > 0) {
        avg = total / reviews.length;
      }

      
      avg = Number(avg.toFixed(2));  // round to 2 decimals

      
      await Vendor.findByIdAndUpdate(vendorId, {   // update vendor rating
        rating: avg
      });
    }

    return res.status(201).json(review);   // sending created review

  } catch (err) {
    console.log('createReview error', err);
    return res.status(500).json({ error: 'Server error creating review' });
  }
};

exports.getReviewsByProduct = async (req, res) => {  // get reviews for one product
  try {
    const productId = req.params.productId;

    const reviews = await Review.find({ product: productId })   // find reviews of product
      .populate('user', 'name')   // show user name
      .populate('product');        // show product details

    return res.json(reviews);
  } catch (err) {
    console.log('getReviewsByProduct error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.listReviews = async (req, res) => {   // list all reviews
  try {
    const reviews = await Review.find()
      .populate('product')       // show product details
      .populate('user', 'name')   // show user name
      .sort({ createdAt: -1 })    // latest first
      .limit(50);

    return res.json(reviews);
  } catch (err) {
    console.log('listReviews error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
