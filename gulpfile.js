var gulp = require('gulp');
var browserify = require('gulp-browserify');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var refresh = require('gulp-livereload');
var lr = require('tiny-lr');
var server = lr();


var __BUILD = false;

function showError(e) {
  console.log('\n===\n');
  console.log('\033[31m Error:\033[0m \n');
  console.log('\033[1m' + e.message + '\033[0m');
  console.log('\n===\n');

}

gulp.task('scripts', function() {
  gulp.src(['./index.js'])
    .pipe(browserify())
    .on('error', showError)
    .pipe(uglify())
    .pipe(concat('model-npm install-min.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(refresh(server));

  gulp.src(['./index.js'])
    .pipe(browserify())
    .on('error', showError)
    .pipe(concat('model-npm install.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(refresh(server));
});

gulp.task('lr-server', function() {
  server.listen(35710, function(err) {
    if (err) return console.log(err, err.stack);
  });
});

gulp.task('default', ['scripts', 'lr-server'], function() {

  gulp.watch(['./src/**'], ['scripts']);

});

gulp.task('build', function() {

  __BUILD = true;

  gulp.run('scripts');
});
