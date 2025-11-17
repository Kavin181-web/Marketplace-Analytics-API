const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.createOrder = async (req, res) => {   // create order
  try {
    const { user, vendor, items } = req.body; // taking data

    if (!user || !vendor || !Array.isArray(items) || !items.length)   // check basic fields
      return res.status(400).json({ error: 'user, vendor and items[] required' });

    
    if (![user, vendor, ...items.map(i => i.product)].every(id => mongoose.Types.ObjectId.isValid(id)))   // check ids are valid
      return res.status(400).json({ error: 'Invalid id in request' });


    const prodIds = items.map(i => i.product);   // getting product prices
    const prods = await Product.find({ _id: { $in: prodIds } }).select('price');

    const map = Object.fromEntries(prods.map(p => [p._id.toString(), p]));   // convert product array to easy lookup map

    
    const finalItems = items.map(i => ({    // preparing items for order schema
      product: i.product,
      qty: i.qty || i.quantity || 1,
      priceAtPurchase: map[i.product]?.price ?? (() => { throw new Error(`Product not found ${i.product}`) })()
    }));
    
    const order = await Order.create({ user, vendor, items: finalItems });  // creating order
    return res.status(201).json(order);
  } catch (err) {
    console.error('createOrder ERR:', err);
    return res.status(500).json({ error: err.message || 'Server error creating order' });
  }
};

exports.getOrderById = async (req, res) => {   // get order by id
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('vendor', 'name city')
      // adjust this populate path to match your schema (menuItemId or product)
      .populate('items.menuItemId', 'name price');

    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.listOrders = async (req, res) => {   // list orders
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(50);
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
