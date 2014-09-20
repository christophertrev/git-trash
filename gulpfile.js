var gulp                                     = require('gulp'),
  browserify                                 = require("browserify"),
  uglify                                     = require("gulp-uglify"),
  del                                        = require("del"),
  reactify = require('reactify'),
  source = require('vinyl-source-stream'),
  concat = require('gulp-concat-sourcemap');
  react                                      = require("gulp-react");

var  paths                                   = {
  index_js: ['./src/main.jsx'],
  libs: ['./vendor/oauth-js/dist/oauth.js'],
  libs_test: ['./vendor/oauth-js/dist/oauth.js', './node_modules/mocha/mocha.js'],
}

gulp.task('clean', function(cb) {
  del(['build/*.*'], cb)
})

//lins is external library vendors which aren't browserify compatible (CommonJS)
gulp.task("libs", function () {
  gulp.src(paths.libs)
    .pipe(concat('libs.js'))
    .pipe(gulp.dest("./build"))
})

//scripts is our script and, optionaly, vendors which are browserify
gulp.task("scripts", ['clean', 'libs'], function() {
  browserify(paths.index_js)
    .transform(reactify)
    .bundle()
    .pipe(source("main.js"))
    .pipe(gulp.dest("./build"))

})

gulp.task("test", ['libs'], function() {
  gulp.src(['./node_modules/mocha/mocha.css'])
    .pipe(concat('test.css'))
    .pipe(gulp.dest('./build'));

  gulp.src(paths.libs_test)
    .pipe(concat('libs-test.js'))
    .pipe(gulp.dest("./build"))   

  browserify('./test/repo.jsx')
    .transform(reactify)
    .bundle()
    .pipe(source("main-test.js"))
    .pipe(gulp.dest("./build"))

})
//refresh when we change
gulp.task('watch', function() {
  gulp.watch('src/*.*', ['scripts'])
  gulp.watch('test/*.*', ['test'])
})


