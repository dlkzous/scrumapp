var mongoose = require('mongoose')
  , Board = mongoose.model('Board')
  , HttpStatus = require('http-status')
  , User = mongoose.model('User');

module.exports = function(req, res) {
  // check if user is authorised
  if(req.session.auth) {
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
      // Check if the board belongs to the user
      Board.findById(data.boardid).exec()
        .then(function(err, board) {
          if(board.owner == req.user._id) {
            // Check if the specified member exists
            return User.findById(data.memberid).exec();
          }
        })
        .then(function(err, members) {
          // if member exists, add the member, else send error
          if(members && members.length > 0) {
            // Add to the board
            return Board.findByIdAndUpdate(
              data.boarid
            , {$push: {members: data.memberid}}
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
  } else {
    res.status(HttpStatus.UNAUTHORIZED);
    res.json({
      message: 'You need to be logged in to view this information'
    });
  }
};
