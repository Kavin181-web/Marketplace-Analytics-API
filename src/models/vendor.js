const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({   // creating vendor schema
  name: {            // vendor/shop name
    type: String,
    required: true 
},    

  gstin: {            // vendor gst number
    type: String, 
    required: true,  // GSTIN is mandatory for each vendor
    unique: true,    // no duplicate gst numbers
},  

  city: {     // vendor city
    type: String, 
    required: true   
 },   

  rating: {           // vendor rating
    type: Number, 
    default: 1,       
    min: 1,           
    max: 5,           
 }       
});

module.exports = mongoose.model('Vendor', VendorSchema);
