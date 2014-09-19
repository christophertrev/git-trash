var gulp                                     = require('gulp'),
  browserify                                 = require("browserify"),
  uglify                                     = require("gulp-uglify"),
  del                                        = require("del"),
  reactify = require('reactify'),
  source = require('vinyl-source-stream'),
  concat = require('gulp-concat-sourcemap');
  react                                      = require("gulp-react");

var  paths                                   = {
  css: ['src/css/**/*.styl'],
  index_js: ['./src/main.jsx'],
  js: ['src/js/*.js'],
  libs: ['./build/vendors/oauth-js/dist/oauth.js'],
}

gulp.task('clean', function(cb) {
  del(['build/*.js'], cb)
})

gulp.task("libs", function () {
  gulp.src(paths.libs)
    .pipe(concat('libs.js'))
    .pipe(gulp.dest("./build"))
})

gulp.task("scripts", ['clean', 'libs'], function() {
  browserify(paths.index_js)
    .transform(reactify)
    .bundle()
    .pipe(source("main.js"))
    .pipe(gulp.dest("./build"))

})

gulp.task('watch', function() {
  gulp.watch('src/*.*', ['scripts'])
})


