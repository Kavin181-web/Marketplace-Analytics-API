const Vendor = require('../models/vendor');

// create vendor
exports.createVendor = async (req, res) => {   // create vendor
  try {
    const { name, gstin, city } = req.body;   // getting data
    if (!name || !gstin || !city) 
      return res.status(400).json({ error: 'name, gstin and city required' });

    const vendor = await Vendor.create({ name, gstin, city });  // saving vendor
    return res.status(201).json(vendor);   // send response
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllVendors = async (req, res) => {       // get all vendors
  try {
    const vendors = await Vendor.find().limit(50);   // get vendor list
    res.json(vendors);           // send list
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getVendorById = async (req, res) => {          // get vendor by id
  try {
    const id = req.params.id;                      // taking id
    const vendor = await Vendor.findById(id);       // find vendor
    if (!vendor) return res.status(404).json({ error: 'Not Found' });
    return res.json(vendor);      // send vendor
  } catch (err) {
    console.error('getVendorById error', err);
    
    if (err.kind === 'ObjectId' || err.name === 'CastError') {   // invalid id error
      return res.status(400).json({ error: 'Invalid ID' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

