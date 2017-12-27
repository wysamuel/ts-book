var gulp = require('gulp');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var browserify = require('browserify'),
    transform = require('vinyl-transform'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps');

var browserified = transform(function(filename) {
  var b = browserify({ entries: filename, debug: true });
  return b.bundle();
});

var tsProject = ts.createProject({
  removeComments : true,
  noImplicitAny : true,
  target : 'ES3',
  module : 'commonjs',
  declarationFiles : false
});

var tsTestProject = ts.createProject({
  removeComments : true,
  noImplicitAny : true,
  target : 'ES3',
  module : 'commonjs',
  declarationFiles : false
});

gulp.task('lint', function() {
  return gulp.src([
    './source/ts/**/**.ts', './test/**/**.test.ts'
  ]).pipe(tslint({
            formatter: "verbose"
        }))
    .pipe(tslint.report());
});

gulp.task('tsc', function() {
  return gulp.src('./source/ts/**/**.ts')
    .pipe(tsProject())
    .js.pipe(gulp.dest('./temp/source/js'));
});

gulp.task('tsc-tests', function() {
  return gulp.src('./test/**/**.test.ts')
    .pipe(tsTestProject ())
    .js.pipe(gulp.dest('./temp/test/'));
});

gulp.task('bundle-js', function () {
  return gulp.src('./temp/source/js/main.js')
    .pipe(browserified)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/source/js/'));
});

gulp.task('bundle-test', function () {
  return gulp.src('./temp/test/**/**.test.js')
    .pipe(browserified)
    .pipe(gulp.dest('./dist/test/'));
});

gulp.task('default', ['lint', 'tsc', 'tsc-tests', 'bundle-js', 'bundle-test']);
