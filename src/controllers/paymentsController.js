const Payment = require('../models/payment');
const Order = require('../models/order');

exports.createPayment = async (req, res) => {  // create payment
  try {
    const { orderId, method } = req.body;  // taking data

    if (!orderId || !method) {   // check required fields
      return res.status(400).json({ error: "orderId and method are required" });
    }


    const order = await Order.findById(orderId);   // find order to calculate total
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

  
    let total = 0;   // calculate total amount
    order.items.forEach(item => {
      total += (item.qty * item.priceAtPurchase);
    });

    
    const already = await Payment.findOne({     // check if payment already exists
      order: orderId, 
      status: { $in: ["pending", "success"] }
     });


    if (already) {
      return res.status(400).json({ error: "Payment already exists for this order" });
    }

   
    const payment = await Payment.create({    // create payment
      order: orderId,
      amount: total,
      method,
      status: "pending"
    });

    return res.status(201).json({
      message: "Payment created",
      paymentId: payment._id,
      amount: total
    });

  } catch (err) {
    console.log("createPayment error:", err);
    return res.status(500).json({ error: "Server error creating payment" });
  }
};


exports.handleGatewayCallback = async (req, res) => {   // webhook (update payment)
  try {
    console.log('gateway callback body:', req.body);

    const { paymentId, orderId, success } = req.body;    // taking data
    if (!paymentId || !orderId) return res.status(400).json({ error: 'paymentId and orderId are required' });

    
    const ok = (typeof success === 'string')   // convert success to true/false
    ? success.toLowerCase() === 'true' 
    : Boolean(success);

    
    const paymentUpdate = ok     // update payment status
      ? { status: 'success', paidAt: new Date() }
      : { status: 'failed' };

    const payment = await Payment.findByIdAndUpdate(paymentId, paymentUpdate, { new: true });

    // ensure payment exists
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    
    const orderStatus = ok ? 'paid' : 'cancelled';  // update order status
    const order = await Order.findByIdAndUpdate(
      orderId, 
      { status: orderStatus }, 
      { new: true }
    );

    if (!order) return res.status(404).json({ error: 'Order not found' });

    console.log('Webhook result:', { payment: payment.status, order: order.status });
    return res.json({ message: ok ? 'Payment successful' : 'Payment failed', payment, order });
  } catch (err) {
    console.error('webhook error:', err);
    return res.status(500).json({ error: 'Server error in webhook' });
  }
};
