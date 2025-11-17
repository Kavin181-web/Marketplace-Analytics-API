const mongoose = require('mongoose'); // importing mongoose

const UserSchema = new mongoose.Schema({  // creating user schema

  name: {    // user name
    type: String,
    required: true,  
  },

  email: {   // user email
    type: String,
    required: true,
    unique: true,          // no duplicate emails
    lowercase: true,       // save in small letters
  },

  city: {     // user city
    type: String,
    default: '',           // not mandatory; default empty string
  },

  createdAt: {     // set time automatically
    type: Date,
    default: Date.now,     
  },
},
{
  
});


module.exports = mongoose.model('User', UserSchema);
