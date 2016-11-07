'use strict';

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*']
}),
    path = require('path'),
    conf = require('./conf'),
    gulp = require('gulp'),
    runSequence = require('run-sequence'),
    sources = [ path.join(conf.paths.src, '/app/**/*.js'), path.join(conf.paths.src, '/app/**/*.js')  ];

gulp.task('jshint', function() {
    return gulp.src(sources)
        .pipe($.using())
        .pipe($.jshint('src/.jshintrc'))
        .pipe($.jshint.reporter(require('jshint-stylish')));
});


gulp.task('code-check', function(done) {
    runSequence('jshint', done);
});