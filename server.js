require('dotenv').config();  // loading .env file values

const app = require('./src/app'); // Importing the Express app instance from app.js
const connectDB = require('./src/config/db');  // Importing our MongoDB connection function
const PORT = process.env.PORT || 5000;  // Setting the port number from environment variables, or default to 5000

// using async function to start server
(async () => {
  try {
    await connectDB();  // Connect to MongoDB before starting the server

   
    app.listen(PORT, () =>  // start the server
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (err) {   // if something fails show error

    console.error('Failed to start', err);
    process.exit(1);  
  }
})();
