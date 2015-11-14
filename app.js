var express = require('express')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , bodyParser = require('body-parser')
  , HttpStatus = require('http-status')
  , path = require('path')
  , mongoose = require('mongoose')
  , everyauth = require('everyauth')
  , secretdata = require('./secretdata')
  , MongoStore = require('connect-mongo')(session);

var app = express();

// if you like to see what is going on, set this to true
if(app.get('env') === 'development') {
  everyauth.debug = true;
} else {
  everyauth.debug = false;
}

require('./models');
var routes = require('./routes');

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

require('./paths')(app, routes);

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
