const Product = require('../models/product');
const Review = require('../models/review'); // to fetch reviews (if don't have virtuals)

exports.createProduct = async (req, res) => {   // create new product
  try {
    const { name, category, price, vendor, stock } = req.body;   // taking data

    // basic required checks
    if (!name || !category || price == null || !vendor) {  // checking required fields
      return res.status(400).json({ error: 'name, category, price and vendor are required' });
    }

    const product = await Product.create({    // saving product
      name,
      category,
      price,
      vendor,
      stock
    });

    return res.status(201).json(product);     // send saved product
  } catch (err) {
    console.error('createProduct error', err);
    return res.status(500).json({ error: 'Server error creating product' });
  }
};

exports.getAllProducts = async (req, res) => {    // get all products
  try {
    const products = await Product.find()
      .populate('vendor')                    // show vendor details
      .limit(100);

    return res.json(products);        // send list
  } catch (err) {
    console.error('getAllProducts error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {      // get product by id
  try {
    const id = req.params.id;    // taking id

    const product = await Product.findById(id)   // get product with vendor details
    .populate('vendor', 'name city rating');

    if (!product) {
      return res.status(404).json({ error: 'Not Found' });
    }

    const reviews = await Review.find({ product: product._id })   // get reviews for this product
    .select('user rating comment createdAt');

    return res.json({ ...product.toObject(), reviews });   // send product + reviews together
  } catch (err) {
    console.error('getProductById error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};