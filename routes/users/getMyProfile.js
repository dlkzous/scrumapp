var HttpStatus = require('http-status');

// Function to get my profile information when logged in
module.exports = function(req, res) {
  if(req.session.auth) {
    res.json({
      user: req.user.toObject({getters: true})
    });
  } else {
    res.status(HttpStatus.UNAUTHORIZED);
    res.json({
      message: 'You need to be logged in to view this information'
    });
  }
};
