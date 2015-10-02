var express = require('express')
  , router = express.Router()
  , getApiInformation = require('./index/getApiInformation');


/* GET home api */
router.route('/')
  .get(getApiInformation);

module.exports = router;
