'use strict';

const gulp = require('gulp');
const fs = require('fs');
const del = require('del');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const ejs = require('gulp-ejs');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config');
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');
const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');

const _config = {
  inputFileName: {
    js: 'import.js',
    css: 'import.scss',
  },
  outputFileName: {
    css: 'style.css',
    js: 'common.js',
  },
  path: {
    src: {
      ejs: './src/ejs',
      css: './src/scss',
      js: './src/js',
    },
    public: './public',
    dist: './dist',
  },
  browserSync: {
    open: false,
    server: './public',
    port: 8080,
    ghostMode: false,
    notify: false,
  },
  autoprefixer: {
    browsers: ['last 2 versions'],
    cascade: false
  },
  minify: {
    html: true,
    js: true,
    css: true,
  }
};

/* generate html files */
gulp.task('html', () => {
  const configFile = `${_config.path.src.ejs}/_config.json`;

  fs.access(configFile, fs.R_OK | fs.W_OK, function (err) {
    const config = (err) ? {} : JSON.parse(fs.readFileSync(configFile, 'utf8'));

    return gulp.src(
      [
        `${_config.path.src.ejs}/**/*.ejs`,
        `!${_config.path.src.ejs}/**/_*.ejs`,
      ]
    )
    .pipe(plumber())
    .pipe(ejs({
      config: config,
    }, {}, {
      ext: '.html'
    }))
    .pipe(gulp.dest(`${_config.path.public}`));
  });
});

/* html-reload */
gulp.task('html-reload', ['html'], (done) => {
  browserSync.reload();
  done();
});

/* generate javascript files */
gulp.task('js', () => {
  return gulp.src(`${_config.path.src.js}/${_config.inputFileName.js}`)
    .pipe(plumber())
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(rename(_config.outputFileName.js))
    .pipe(gulp.dest(`${_config.path.public}/assets/js`));
});

/* js-reload */
gulp.task('js-reload', ['js'], (done) => {
  browserSync.reload();
  done();
});

/* generate css files */
gulp.task('css', () => {
  return gulp
    .src(`${_config.path.src.css}/${_config.inputFileName.css}`)
    .pipe(plumber())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer(_config.autoprefixer))
    .pipe(rename(_config.outputFileName.css))
    .pipe(gulp.dest(`${_config.path.public}/assets/css`))
    .pipe(browserSync.stream());
});

/* serve */
gulp.task('serve', ['css'], () => {
  browserSync.init(_config.browserSync);
  gulp.watch(`${_config.path.src.ejs}/**/*.ejs`, ['html-reload']);
  gulp.watch(`${_config.path.src.ejs}/_config.json`, ['html-reload']);
  gulp.watch(`${_config.path.src.js}/**/*.js`, ['js-reload']);
  gulp.watch(`${_config.path.src.css}/**/*.scss`, ['css']);
});

/* default task */
gulp.task('default', ['html', 'js', 'css', 'serve']);

/* clean */
gulp.task('clean', () => {
  return del([
    `${_config.path.public}/**/*.ejs`,
    _config.path.dist
  ]);
});

/* copy */
gulp.task('copy', () => {
  return gulp
    .src(`${_config.path.public}/**`, {
      base: _config.path.public
    })
    .pipe(gulp.dest(_config.path.dist));
});

/* minify html */
gulp.task('minifyHtml', () => {
  if (_config.minify.html) {
    return gulp
      .src(`${_config.path.dist}/**/*.html`)
      .pipe(htmlmin({
        collapseWhitespace: true
      }))
      .pipe(gulp.dest(_config.path.dist));
  }
});

/* minify js */
gulp.task('minifyJs', () => {
  if (_config.minify.js) {
    return gulp
      .src(`${_config.path.dist}/**/*.js`)
      .pipe(uglify({
        preserveComments: 'some'
      }))
      .pipe(gulp.dest(_config.path.dist));
  }
});

/* minify css */
gulp.task('minifyCss', () => {
  if (_config.minify.css) {
    return gulp
      .src(`${_config.path.dist}/**/*.css`)
      .pipe(cssmin())
      .pipe(gulp.dest(_config.path.dist));
  }
});

/* build */
gulp.task('build', () => {
  runSequence(
    'clean',
    'copy',
    'minifyHtml',
    'minifyJs',
    'minifyCss'
  );
});
