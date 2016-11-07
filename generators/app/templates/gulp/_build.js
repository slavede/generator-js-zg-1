'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var runSequence = require('run-sequence');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

// goes through index.html
// with userref takes build blocks and minifies stuff
// it moves everything at the end into dist folder

// 1. userref will concatenate everything into target .css/.js based on files inside the anotations (inject will put them there) inside index.html
// 2. file which it created (e.g. app.js), it will assign revision ($.rev())
// 3. it will do additional task on it (uglify, minifyHtml, minifyCss)
// 4. revReplace will go again into index.html and apply new revision
// 5. everything will be moved into dist folder then
gulp.task('html', ['inject'], function () {

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe($.using())
    .pipe($.useref({}))
    .pipe($.using({prefix:'useref'}))

    .pipe($.if('*.js', $.using({prefix:'if *.js'})))
    .pipe($.if('*.js', $.rev()))
    .pipe($.if('*.js', $.sourcemaps.init()))
    .pipe($.if('*.js', $.uglify({ preserveComments: $.uglifySaveLicense }).on('error', conf.errorHandler('Uglify'))))
    .pipe($.if('*.js', $.sourcemaps.write('maps')))

    .pipe($.if('*.css', $.using({prefix:'if *.css'})))
    .pipe($.if('*.css', $.rev()))
    .pipe($.if('*.css', $.sourcemaps.init()))
    .pipe($.if('*.css', $.replace(/\.\.\/\.\.\/bower_components\/.*?\/fonts/g, '../assets/fonts/')))
    .pipe($.if('*.css', $.replace('../fonts/', '../assets/fonts/')))
    .pipe($.if('*.css', $.minifyCss({ processImport: false })))
    .pipe($.if('*.css', $.sourcemaps.write('maps')))

    .pipe($.if('*.html',  $.using({prefix:'if html'})))
    .pipe($.if('*.html',  $.minifyHtml({
                                  empty: true,
                                  spare: true,
                                  quotes: true,
                                  conditionals: true
                                })))
        // ))
    .pipe($.revReplace())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    // .pipe($.using({prefix:'Moving to dist'}))
    // .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
  });

<%if (useLess) {%>

    gulp.task('less', function() {
        return gulp.src(conf.paths.src + '/less/main.less')
            .pipe($.less({
                paths: [ path.join(__dirname, 'less', 'includes') ]
            }))
            .pipe(gulp.dest(conf.paths.src + '/css'));
    })

    gulp.task('build', function(done) {
        runSequence('less', 'code-check', 'html', done);
    });
<% } else if (useSass) { %>
    gulp.task('sass', function() {
        return gulp.src(conf.paths.src + '/sass/main.sass')
            .pipe($.sass().on('error', $.sass.logError))
            .pipe(gulp.dest(conf.paths.src + '/css'));
    });

    gulp.task('build', function(done) {
        runSequence('sass', 'code-check', 'html', done);
    });
<% } else { %>
    gulp.task('build', function(done) {
        runSequence('code-check', 'html', done);
    });
<% } %>


