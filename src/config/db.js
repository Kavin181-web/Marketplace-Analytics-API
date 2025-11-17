const mongoose = require('mongoose'); // Importing mongoose library to connect and interact with MongoDB

const connectDB = async () => {   // Creating an asynchronous function to connect to the MongoDB database

  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/marketplace';  // taking url from .env (if not there use local)

  await mongoose.connect(uri, {  // Connecting to MongoDB using mongoose
    useNewUrlParser: true,      
    useUnifiedTopology: true,   
  });

  console.log('MongoDB connected');
};

// Exporting the connectDB function so it can be used in server.js
module.exports = connectDB;
