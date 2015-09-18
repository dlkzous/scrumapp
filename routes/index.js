var express = require('express')
  , router = express.Router();


/* GET home api */
router.route('/')
  .get(function(req, res, next) {
    res.json({
      title: 'ScrumAPI',
      version: '0.0.1'
    });
  });

module.exports = router;
