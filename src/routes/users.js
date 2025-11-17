const express = require('express');
const router = express.Router();         // making router object
const usersController = require('../controllers/usersController');
console.log(usersController);

router.post('/', usersController.createUsers);  // create new user

router.get('/', usersController.getAllUsers);   // get all users

module.exports = router;
