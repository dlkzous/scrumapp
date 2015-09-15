// include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint')
  , nodemon = require('gulp-nodemon')
  , install = require('gulp-install')
  , del = require('del')
  , mocha = require('gulp-mocha')
  , child_process = require('child_process');

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
  child_process.exec('mongod --nojournal', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});

// Start server using nodemon
gulp.task('start', ['startdb'], function () {
  nodemon({
      script: 'bin/www'
    , ext: 'js'
    , env: { 'NODE_ENV': 'development' }
  });
});

// Task to run mocha test
gulp.task('test', function() {
  gulp.src('./tests/main.js', {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['start']);
