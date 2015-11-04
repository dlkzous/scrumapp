var mongoose = require('mongoose')
  , User = mongoose.model('User');

// Function to get all users from the database
module.exports = function(req, res){
  User.find(function(err, users) {
    res.json({
      users: users
    });
  }).sort({name: -1});
};
