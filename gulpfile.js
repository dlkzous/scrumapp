// include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var install = require('gulp-install');
var del = require('del');
var mocha = require('gulp-mocha');

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

// Start server using nodemon
gulp.task('start', function () {
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
