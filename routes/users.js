var express = require('express')
  , router = express.Router()
  , getAllUsers = require('./users/getAllUsers')
  , getMyProfile = require('./users/getMyProfile');

// Users api
router.route('/')
  .get(getAllUsers);

router.route('/profile')
  .get(getMyProfile);

module.exports = router;
