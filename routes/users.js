var mongoose = require('mongoose')
  , express = require('express')
  , router = express.Router()
  , User = mongoose.model('User')
  , HttpStatus = require('http-status');

// Users api
router.route('/')
  .get(function(req, res) {
    User.find(function(err, users) {
      res.json({
        users: users
      });
    });
  });

router.route('/profile')
  .get(function(req, res) {
    if(req.session.auth) {
      res.json({
        user: req.user.toObject({getters: true})
      });
    } else {
      res.status(HttpStatus.UNAUTHORIZED);
      res.json({
        message: 'You need to be logged in to view this information'
      });
    }
  });

module.exports = router;
