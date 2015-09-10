// include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');

// JS hint task
gulp.task('jshint', function() {
  gulp.src(['**', '!node_modules/**/'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Start server using nodemon
gulp.task('start', function () {
  nodemon({
    script: 'bin/www'
  , ext: 'js'
  , env: { 'NODE_ENV': 'development' }
  })
})

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['start']);
