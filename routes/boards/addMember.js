var mongoose = require('mongoose')
  , Board = mongoose.model('Board')
  , HttpStatus = require('http-status')
  , User = mongoose.model('User');

module.exports = function(req, res) {
  var data = req.body;

  var requiredFields = {
      memberid: 'Field is required'
    , boardid: 'Field is required'
  };

  // check if required fields are present
  if(!data.memberid || !data.boardid) {
    res.status(HttpStatus.BAD_REQUEST);
    res.json({
        success: false
      , message: requiredFields
    });
  } else {
    // Check if the specified member exists
    User.findById(data.memberid).exec()
      .then(function(err, members) {
        // if member exists, add the member, else send error
        if(members && members.length > 0) {
          // Add to the board
          return Board.findByIdAndUpdate(
            data.boarid
          , {$push: {members: memberid}}
          , {upsert: false}).exec();
        } else {
          res.status(HttpStatus.BAD_REQUEST);
          res.json({
              success: false
            , message: 'Given user does not exist'
          });
        }
      })
      .then(function(err, board){
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
};
