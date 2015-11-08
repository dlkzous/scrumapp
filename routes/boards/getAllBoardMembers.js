var mongoose = require('mongoose')
  , Board = mongoose.model('Board')
  , User = mongoose.model('User')
  , HttpStatus = require('http-status')
  , ObjectId = require('mongodb').ObjectID;
  
var _failedRequest = function(res, err) {
  if(err && err.message !== 'scrumapilocalerror') {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.json({
      err: err
    });
  }
};
  
// Function to get all members belonging to a particular board from the database
module.exports = function(req, res){
  
  // check if the user is logged in
  if(req.session.auth) {
    Board.findById(req.params.id).exec()
      .then(function(board) {
        
        // ensure board belongs to user
        if(board.owner.equals(req.user._id)) {
          // get all the individual board members
          // var list = [];
          // for(var x=0; x<board.members.length; x++) {
          //   list.push(new ObjectId(board.members[x].toJSON()));
          // }    
          return User.find({_id: { $in: board.members}}).exec(); 
        } else {
          res.status(HttpStatus.BAD_REQUEST);
          res.json({
              success: false
            , message: 'Board does not belong to the user'
          });
          throw new Error('scrumapilocalerror');
        }
      })
      .then(function(users){
        res.json({
          users: users
        });
      }, function(err) {
        _failedRequest(res, err);
      });
  } else {
    res.status(HttpStatus.UNAUTHORIZED);
    res.json({
      message: 'You need to be logged in to view this information'
    });
  }
};
