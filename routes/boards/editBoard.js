var mongoose = require('mongoose')
  , Board = mongoose.model('Board')
  , HttpStatus = require('http-status');
  
module.exports = function(req, res) {
  var data = req.body;
  // check if the user is logged in
  if(req.session.auth) {
    Board.findById(req.params.id).exec()
      .then(function(board) {
        
        // ensure board belongs to user
        if(board.owner.equals(req.user._id)) {
          // Update the board information
          if(typeof data.name != 'undefined') {
            board.name = data.name;
            board.save();
          }
        } else {
          res.status(HttpStatus.BAD_REQUEST);
          res.json({
              success: false
            , message: 'Board does not belong to the user'
          });
          throw new Error('scrumapilocalerror');
        }
      })
      .then(function() {
        res.json({
            success: true
          , message: 'Board updated successfully'
        });
      }, function(err) {
          if(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            res.json({
              err: err
            });
          }
      });
  } else {
    res.status(HttpStatus.UNAUTHORIZED);
    res.json({
      message: 'You need to be logged in to view this information'
    });
  }
};