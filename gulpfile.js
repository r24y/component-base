var gulp = require('gulp');
var babel = require('gulp-babel');
var browserify = require('gulp-browserify');

gulp.task('default', function () {
    return gulp.src('src/index.js')
        .pipe(babel())
        .pipe(browserify())
        .pipe(gulp.dest('.'));
});
