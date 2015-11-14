var mongoose = require('mongoose')
  , Board = mongoose.model('Board')
  , HttpStatus = require('http-status');

// Function to get all users from the database
module.exports = function(req, res){
  if(req.session.auth) {
    Board.find({owner: req.user}, function(err, boards) {
      res.json({
        boards: boards
      });
    }).sort({name: -1});
  } else {
    res.status(HttpStatus.UNAUTHORIZED);
    res.json({
      message: 'You need to be logged in to view this information'
    });
  }
};
