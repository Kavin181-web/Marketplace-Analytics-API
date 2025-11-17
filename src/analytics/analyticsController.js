const mongoose = require('mongoose');
const Order = require('../models/order');
const Payment = require('../models/payment');
const Product = require('../models/product');
const Review = require('../models/review');

exports.overview = async (req, res) => {   //Overview: total revenue, total paid orders, avg order value
  try {

    const rev = await Payment.aggregate([   // sum all successful payment amounts
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = rev[0]?.total || 0;

    const totalOrders = await Order.countDocuments({ status: 'paid' }); // count how many orders are marked paid
    
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;  // average order value = revenue / paid orders
    return res.json({ totalRevenue, totalOrders, avgOrderValue });
  } catch (err) {
    console.error('overview error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.topVendors = async (req, res) => {   //Top vendors by GMV (sum of qty * priceAtPurchase from paid orders)
  try {
    const data = await Order.aggregate([
      { $match: { status: 'paid' } },      // only paid orders
      { $unwind: '$items' },               // one doc per item
      { $addFields: { lineTotal: { $multiply: ['$items.qty', '$items.priceAtPurchase'] } } },
      { $group: { _id: '$vendor', gmv: { $sum: '$lineTotal' } } },   // sum per vendor
      { $sort: { gmv: -1 } },                                       // highest first
      { $project: { vendorId: '$_id', gmv: 1, _id: 0 } }           // shape result
    ]);
    return res.json(data);
  } catch (err) {
    console.error('topVendors error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.topProducts = async (req, res) => {    //Top products by qty sold (from paid orders)
  try {
    const data = await Order.aggregate([
      { $match: { status: 'paid' } },
      { $unwind: '$items' },
      { $group: { _id: '$items.product', qty: { $sum: '$items.qty' } } },   // sum qty by product
      { $sort: { qty: -1 } },
      { $project: { productId: '$_id', qty: 1, _id: 0 } }
    ]);
    return res.json(data);
  } catch (err) {
    console.error('topProducts error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.categoryStats = async (req, res) => {  //categoryStats: revenue + productCount per category
  try {
    const data = await Order.aggregate([
      { $match: { status: 'paid' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'prod'
        }
      },
      { $unwind: { path: '$prod', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$prod.category',
          revenue: { $sum: { $multiply: ['$items.qty', '$items.priceAtPurchase'] } },
          productsSet: { $addToSet: '$items.product' }
        }
      },
      { $project: { category: '$_id', revenue: 1, productCount: { $size: '$productsSet' }, _id: 0 } },
      { $sort: { revenue: -1 } }
    ]);
    return res.json(data);
  } catch (err) {
    console.error('categoryStats error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.vendorRating = async (req, res) => {   //vendorRating: average rating across all products of a vendor
  try {
    
    const vendorId = new mongoose.Types.ObjectId(req.params.vendorId);   // convert param to ObjectId
    
    const prods = await Product.find({ vendor: vendorId }).select('_id').lean();   // find products that belong to this vendor
    const prodIds = prods.map(p => p._id);
    if (!prodIds.length) return res.json({ vendorId: req.params.vendorId, averageRating: 0 });

    const agg = await Review.aggregate([    // average rating across reviews of these products
      { $match: { product: { $in: prodIds } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const avg = agg[0]?.avgRating || 0;
    return res.json({ vendorId: req.params.vendorId, averageRating: Number(avg.toFixed(2)) });
  } catch (err) {
    console.error('vendorRating error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.revenueTrend = async (req, res) => {   //revenueTrend: weekly revenue for last 12 weeks
  try {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - (7 * 12)); // 12 weeks back

    const data = await Payment.aggregate([
      { $match: { status: 'success', paidAt: { $gte: startDate } } },
      { $project: { amount: 1, paidAt: 1, yearWeek: { $dateToString: { format: "%Y-%U", date: "$paidAt" } } } },
      { $group: { _id: '$yearWeek', revenue: { $sum: '$amount' } } },
      { $sort: { _id: 1 } },
      { $project: { week: '$_id', revenue: 1, _id: 0 } }
    ]);
    return res.json(data);
  } catch (err) {
    console.error('revenueTrend error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
