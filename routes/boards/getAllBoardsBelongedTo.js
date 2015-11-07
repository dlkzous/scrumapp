var mongoose = require('mongoose')
  , Board = mongoose.model('Board')
  , HttpStatus = require('http-status');

// Function to get all users from the database
module.exports = function(req, res){
  
  // check if the user is logged in
  if(req.session.auth) {
    Board.find({members: req.user}).exec()
      .then(function(boards) {
        res.json({
          boards: boards
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
