var mongoose = require('mongoose')
  , express = require('express')
  , router = express.Router()
  , UserModel = mongoose.model('UserModel');

// Users api
router.route('/')
  .get(function(req, res) {
    UserModel.find(function(err, users) {
      res.json({
        users: users
      });
    });
  });

module.exports = router;
