var mongoose = require('mongoose')
  , Board = mongoose.model('Board');

// Function to get all users from the database
module.exports = function(req, res){
  Board.find(function(err, boards) {
    res.json({
      boards: boards
    });
  });
};
