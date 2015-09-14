var appPath = __dirname
  , express = require('express')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , HttpStatus = require('http-status')
  , path = require('path')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , everyauth = require('everyauth')
  , config = require('./config.js');

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
    require(models_path+'/'+file)
});
var UserModel = mongoose.model('UserModel');


var routes = require('./routes/index');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);

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
