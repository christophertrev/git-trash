var gulp                                     = require('gulp'),
  browserify                                 = require("browserify"),
  uglify                                     = require("gulp-uglify"),
  del                                        = require("del"),
  reactify = require('reactify'),
  source = require('vinyl-source-stream'),
  react                                      = require("gulp-react");

var  paths                                   = {
    css: ['src/css/**/*.styl'],
    index_js: ['./src/main.jsx'],
    js: ['src/js/*.js'],
  }

gulp.task('clean', function(cb) {
  del(['build/*.js'], cb)
})

gulp.task("scripts", ['clean'], function() {
  browserify(paths.index_js)
    .transform(reactify)
    .bundle()
    .pipe(source("main.js"))
    .pipe(gulp.dest("./builda"))
})

gulp.task('watch', function() {
  gulp.watch('src/*.*', ['scripts'])
})


