var mongoose = require('mongoose')
  , Board = mongoose.model('Board')
  , HttpStatus = require('http-status');

module.exports = function(req, res) {

  // check if user is authorised
  if(req.session.auth) {
    // check if required fields are present
    var data = req.body;

    var requiredFields = {
        name: 'Field is required'
    };

    if(!data.name) {
      res.status(HttpStatus.BAD_REQUEST);
      res.json({
          success: false
        , message: requiredFields
      });
    } else {
      var board = new Board({
          name: data.name
        , owner: req.user
      });

      board.save(function(err, board) {
        if(err) {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR);
          res.json({
            err: err
          });
        } else {
          res.json({
              success: true
            , board: board
          });
        }
      });
    }
  } else {
    res.status(HttpStatus.UNAUTHORIZED);
    res.json({
      message: 'You need to be logged in to view this information'
    });
  }
};
