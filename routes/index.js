var express = require('express');
var router = express.Router();

/* GET home page. */
router.route('/')
  .get(function(req, res, next) {
    res.json({
      title: 'ScrumAPI',
      version: '0.0.1'
    });
  });

module.exports = router;
