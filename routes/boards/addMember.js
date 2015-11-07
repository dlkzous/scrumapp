var mongoose = require('mongoose')
  , Board = mongoose.model('Board')
  , HttpStatus = require('http-status')
  , User = mongoose.model('User');
  
var _failedRequest = function(res, err) {
  if(err && err.message !== 'scrumapilocalerror') {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.json({
      err: err
    });
  }
};

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
      return res.json({
          success: false
        , message: requiredFields
      });
    } else {
      // Check if the board belongs to the user
      Board.findById(data.boardid).exec()
        .then(function(board) {
          if(board.owner.equals(req.user._id)) {
            // Check if the specified member exists
            return User.findById(data.memberid).exec();
          } else {
            res.status(HttpStatus.BAD_REQUEST);
            res.json({
                success: false
              , message: 'Board does not belong to the user'
            });
            throw new Error('scrumapilocalerror');
          }
        })
        .then(function(member) {
          // if member exists, add the member, else send error
          if(member) {
            // Add to the board
            return Board.update(
              {_id: data.boardid}
            , {$addToSet: {members: member._id}}
            , {upsert: false});
          } else {
            res.status(HttpStatus.BAD_REQUEST);
            res.json({
                success: false
              , message: 'Given user does not exist'
            });
            throw new Error('scrumapilocalerror');
          }
        })
        .then(function(result){
          res.json({
              success: true
            , message: result.n + ' boards succesfully updated'
          });
        }, function(err) {
          _failedRequest(res, err);
        });
    }
  } else {
    res.status(HttpStatus.UNAUTHORIZED);
    res.json({
      message: 'You need to be logged in to view this information'
    });
  }
};
