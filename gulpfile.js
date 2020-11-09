'use strict';

var gulp             = require('gulp');
var concat           = require('gulp-concat');
var cp               = require('child_process');
var cssmin           = require('gulp-cssmin');
var del              = require('del');
var fs               = require('fs');
var prefix           = require('gulp-autoprefixer');
var rename           = require('gulp-rename');
var replace          = require('gulp-replace');
var sass             = require('gulp-sass');
var sourcemaps       = require('gulp-sourcemaps');
var uglify           = require('gulp-uglify');
var browserSync      = require('browser-sync').create();
var packagejson      = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

gulp.task('version-build', function(cb) {
  fs.writeFile('./src/temp/version.txt', packagejson.version, (error) => { /* handle error */ });
  fs.writeFile('./src/temp/version.scss', '/*\n *\n *\n * ' + packagejson.description + '\n * Version: ' + packagejson.version + '\n *\n *\n */', (error) => { /* handle error */ });
  fs.writeFile('./src/temp/version.js', '/*\n *\n *\n * ' + packagejson.description + '\n * Version: ' + packagejson.version + '\n *\n *\n */', (error) => { /* handle error */ }, cb);
});

gulp.task('sass-build', function () {
  return gulp.src('./src/sass/theme.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(replace('/*!', '/*'))
    .pipe(prefix(['last 3 versions', '> 1%', 'ie 8'], { cascade: true }))
    .pipe(cssmin())
    .pipe(rename('theme.min.css'))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('js-build', function(){
  return  gulp.src(['./src/temp/version.js', './src/scripts/**/*.js'])
    .pipe(concat('theme.js'))
    .pipe(replace('/*!', '/*'))
    .pipe(uglify())
    .pipe(rename('theme.min.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('copy-assets-dist', function() {
  return gulp.src('./assets/dist/**')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-assets-root', function() {
  return gulp.src('./assets/_root/**')
    .pipe(gulp.dest('./_site/'));
});

gulp.task('sass-watch', function () {
  return gulp.src('./src/sass/theme.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(replace('/*!', '/*'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(gulp.dest('./_site/dist/css/'))
});

gulp.task('js-watch', function(){
  return  gulp.src(['./src/temp/version.js', './src/scripts/**/*.js'])
    .pipe(concat('theme.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(gulp.dest('./_site/dist/js/'))
});

gulp.task('jekyll-build-dev', function() {
  return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--incremental', '--config=_config_dev.yml'], {stdio: 'inherit'})
});

gulp.task('jekyll-build-production', function() {
  return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--incremental', '--config=_config.yml'], {stdio: 'inherit'})
});

gulp.task('delete-dist', del.bind(null, ['./dist'], {dot: true, force: true}));

gulp.task('browser-sync',function () {
  browserSync.init({
    server: {
      baseDir: '_site'
    },
    notify: false
  });
});

gulp.task('reload',function (done) {
  browserSync.reload();
  done();
});

gulp.task('serve', function () {
  gulp.watch(['**/**.html', '_data/**/*', '_posts/**/*', '_pages/**/*', '**/*.md', '**/*.yaml', '**/*.yml'], gulp.series(['jekyll-build-dev', 'reload']));
  gulp.watch(['./src/sass/**.scss'], gulp.series(['sass-watch', 'reload']));
  gulp.watch(['./src/temp/version.js', './src/scripts/**/*.js'], gulp.series(['js-watch', 'reload']));
  gulp.watch(['./assets/_root/**'], gulp.series(['copy-assets-root', 'reload']));
  gulp.watch(['./assets/dist/**'], gulp.series(['copy-assets-dist', 'reload']));
});

gulp.task('watch', gulp.series(['delete-dist', 'sass-watch', 'js-watch', 'copy-assets-dist', 'jekyll-build-dev', 'copy-assets-root'], gulp.parallel('browser-sync', 'serve')));
gulp.task('build', gulp.series('delete-dist', 'version-build', 'sass-build', 'js-build', 'copy-assets-dist', 'jekyll-build-production', 'copy-assets-root'))
