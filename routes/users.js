var mongoose = require('mongoose')
  , UserModel = mongoose.model('UserModel');

exports.index = function(req, res){
  UserModel.find(function(err, users) {
    res.json({
      users: users
    });
  });
};
