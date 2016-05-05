var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify');


gulp.task('min', function () {
  gulp.src('src/*.js')
  .pipe(concat('apiss.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist/'))
});