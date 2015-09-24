// include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint')
  , nodemon = require('gulp-nodemon')
  , install = require('gulp-install')
  , del = require('del')
  , mocha = require('gulp-mocha')
  , child_process = require('child_process')
  , runSequence = require('run-sequence')
  , postMortem = require('gulp-postmortem');

// JS hint task
gulp.task('jshint', function() {
  gulp.src(['**/*.js', '!node_modules/**/'])
    .pipe(jshint({laxcomma: true}))
    .pipe(jshint.reporter('default'));
});

// Task to install required dependencies
gulp.task('install', function() {
  gulp.src(['./bower.json', './package.json'])
    .pipe(install());
});

// Task to clean the node modules folder
gulp.task('clean', function() {
  del(['node_modules']).then(function (paths) {
     console.log('Deleted files/folders:\n', paths.join('\n'));
  });
});

// Start the database server
gulp.task('startdb', function() {
  child_process.exec('mongod --fork --logpath ./data/dblog.log --nojournal', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});

// Stop the database server
gulp.task('stopdb', function(callback) {
  child_process.exec('mongo --eval "db.getSiblingDB(\'admin\').shutdownServer()"', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});

// Start server using nodemon
gulp.task('startserver', function () {
  nodemon({
      script: 'bin/www'
    , ext: 'js'
    , env: { 'NODE_ENV': 'development' }
  });
});

// Main task to start database and server
gulp.task('start', function(callback) {
  runSequence('startdb', 'startserver', callback);
});

// Task to run mocha test
gulp.task('mochatest', function() {
  // Run test
  gulp.src('./tests/main.js', {read: false})
    .pipe(mocha({reporter: 'list'}))
    .once('error', function () {
        process.exit(1);
    })
    .once('end', function () {
        process.exit();
    });
});

// Task to run start db server, run test and then shutdown db
gulp.task('test', function(callback) {
  runSequence('mochatest', callback);
});

// Task to seed database
gulp.task('seed', function() {
  // Seed users
  child_process.exec('mongoimport --db scrumapi --collection users --file ./tests/db/users.json --jsonArray --host 127.0.0.1 --drop', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});

// Task to clear seed data from the db
gulp.task('cleardb', function() {
  child_process.exec('mongo scrumapi --eval "db.users.remove({})"', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['start']);
