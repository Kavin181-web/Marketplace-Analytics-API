const User = require('../models/user');
exports.createUsers = async (req, res) => {   // create user
  try {
    const { name, email, city } = req.body;   // taking data

    if (!name || !email) 
      return res.status(400).json({ error: 'name and email required' });  // checking required fields

    const user = await User.create({ name, email, city });  // saving user
    return res.status(201).json(user);
  } catch (err) {
    console.error(err);
    
    if (err.code === 11000)   // duplicate email simple check
      return res.status(400).json({ error: 'email already exists' });

    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {    // get all users
  try {
    const users = await User.find().limit(50);
    res.json(users);     // send response
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
