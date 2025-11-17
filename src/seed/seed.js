require('dotenv').config();  // load env file
const connectDB = require('../config/db');   // db connection

// Models
const User = require('../models/user');
const Vendor = require('../models/vendor');
const Product = require('../models/product');
const Order = require('../models/order');
const Payment = require('../models/payment');
const Review = require('../models/review');

async function seed() {
  try {
    console.log("Connecting to DB...");
    await connectDB();
    

    // Clear old data
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Payment.deleteMany({});
    await Review.deleteMany({});
    console.log("Old data cleared.");


    const users = await User.create([   // adding users
      { name: "Kavin", email: "kavin@mail.com", city: "Chennai" },
      { name: "Geetha", email: "geetha@mail.com", city: "Bengaluru" }
    ]);
    console.log("Users added.");


    const vendors = await Vendor.create([     // adding vendors
      { name: "Tasty Foods", gstin: "33AAA1111A1Z2", city: "Chennai", rating: 4.5 },
      { name: "Mobile Store", gstin: "33BBB2222B1Z3", city: "Bengaluru", rating: 4.0 }
    ]);
    console.log("Vendors added.");


    const products = await Product.create([   // adding products
      { name: "Chips", category: "snacks", price: 40, vendor: vendors[0]._id, stock: 100 },
      { name: "Samosa", category: "snacks", price: 20, vendor: vendors[0]._id, stock: 50 },
      { name: "USB Cable", category: "electronics", price: 150, vendor: vendors[1]._id, stock: 200 }
    ]);
    console.log("Products added.");


    const order = await Order.create({  // adding Orders
      user: users[0]._id,
      vendor: vendors[0]._id,
      items: [
        { product: products[0]._id, qty: 2, priceAtPurchase: 40 }
      ],
      status: "paid"
    });
    console.log("Order added.");


    await Payment.create({   //adding Payment
      order: order._id,
      amount: 80,
      method: "card",
      status: "success",
      paidAt: new Date()
    });
    console.log("Payment added.");


    await Review.create([  // adding reviews
      { user: users[0]._id, product: products[0]._id, rating: 4, comment: "Good!" },
      { user: users[1]._id, product: products[2]._id, rating: 5, comment: "Super quality!" }
    ]);
    console.log("Reviews added.");

    console.log("SEEDING DONE");
    process.exit(0);

  } catch (err) {
    console.error("SEED ERROR:", err);
    process.exit(1);
  }
}

seed();
