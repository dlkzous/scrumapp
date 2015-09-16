var appPath = __dirname
  , express = require('express')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , bodyParser = require('body-parser')
  , HttpStatus = require('http-status')
  , path = require('path')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , everyauth = require('everyauth')
  , config = require('./config.js')
  , secretdata = require('./secretdata.js')
  , MongoStore = require('connect-mongo')(session);

var app = express();

// if you like to see what is going on, set this to true
if(app.get('env') === 'development') {
  everyauth.debug = true;
} else {
  everyauth.debug = false;
}

/** Connect to database and load models **/
mongoose.connect(config.dbPath);
var models_path = appPath + '/models';
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path+'/'+file);
});
var UserModel = mongoose.model('UserModel');

/**
 * Social login integration using Facebook
 */
everyauth.everymodule.findUserById(function(userId,callback) {
    UserModel.findOne({facebook_id: userId},function(err, user) {
        callback(user, err);
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


var routes = require('./routes/index')
  , users = require('./routes/users');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(secretdata.COOKIE_PARSER_SECRET));
app.use(session({
    secret: secretdata.SESSION_SECRET
  , store: new MongoStore({mongooseConnection: mongoose.connection})
  , resave: false
  , saveUninitialized: true
}));
app.use(everyauth.middleware());

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error(HttpStatus[404]);
  err.status = HttpStatus.NOT_FOUND;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR);
    res.json({
        message: err.message
      , error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR);
  res.json({
      message: err.message
    , error: {}
  });
});


module.exports = app;
