var appPath = __dirname
  , mongoose = require('mongoose')
  , fs = require('fs')
  , everyauth = require('everyauth')
  , secretdata = require('./secretdata')
  , config = require('./config');

/** Connect to database and load models **/
mongoose.connect(config.dbPath);
var models_path = appPath + '/models';
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path+'/'+file);
});
var UserModel = mongoose.model('User');
var BoardModel = mongoose.model('Board');

/**
 * Social login integration using Facebook
 */
everyauth.everymodule.findUserById(function(userId,callback) {
    UserModel.findOne({_id: userId},function(err, user) {
        callback(err, user);
    });
});
everyauth.facebook
    .appId(secretdata.FACEBOOK_APP_ID)
    .appSecret(secretdata.FACEBOOK_APP_SECRET)
    .scope('email,user_location,user_photos,publish_actions')
    .handleAuthCallbackError( function (req, res) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.json({
          message: 'Error Occured'
        });
    })
    .findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {

        var promise = this.Promise();
        UserModel.findOne({facebook_id: fbUserMetadata.id},function(err, user) {
            if (err) return promise.fulfill([err]);

            if(user) {
                // user found, life is good
                promise.fulfill(user);
            } else {
                // create new user
                var User = new UserModel({
                    name: fbUserMetadata.name,
                    firstname: fbUserMetadata.first_name,
                    lastname: fbUserMetadata.last_name,
                    email: fbUserMetadata.email,
                    username: fbUserMetadata.username,
                    gender: fbUserMetadata.gender,
                    facebook_id: fbUserMetadata.id,
                    facebook: fbUserMetadata
                });

                User.save(function(err,user) {
                    if (err) return promise.fulfill([err]);
                    promise.fulfill(user);
                });
            }
        });
        return promise;
    })
    .redirectPath('/');
