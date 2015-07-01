var gulp = require('gulp');
var babel = require('gulp-babel');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');

gulp.task('default', function () {
    return gulp.src('src/main.js')
        .pipe(rename('index.js'))
        .pipe(babel())
        .pipe(browserify())
        .pipe(gulp.dest('.'));
});
