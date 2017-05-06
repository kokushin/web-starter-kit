const gulp = require('gulp')
const fs = require('fs')
const del = require('del')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')
const ejs = require('gulp-ejs')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const webpackConfig = require('./webpack.config')
const postcss = require('gulp-postcss')
const cssnext = require('postcss-cssnext')
const atImport = require('postcss-import')
const easings = require('postcss-easings')
const browserSync = require('browser-sync').create()
const runSequence = require('run-sequence')
const htmlmin = require('gulp-htmlmin')
const cssmin = require('gulp-cssmin')
const uglify = require('gulp-uglify')

const _config = {
  filename: {
    css: 'style.css',
    js: 'common.js',
  },
  path: {
    src: {
      ejs: './src/ejs',
      css: './src/css',
      js: './src/js',
    },
    public: './public',
    dist: './dist',
  },
  browserSync: {
    server: './public',
    port: 8080,
    ghostMode: false,
    notify: false,
  }
}

/* generate html files */
gulp.task('html', () => {
  const configFile = `${_config.path.src.ejs}/config.json`
  const config = JSON.parse(fs.readFileSync(configFile, 'utf8'))
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
  .pipe(gulp.dest(`${_config.path.public}`))
})

/* html-reload */
gulp.task('html-reload', ['html'], (done) => {
  browserSync.reload()
  done()
})

/* generate javascript files */
gulp.task('js', () => {
  return webpackStream(webpackConfig, webpack)
    .pipe(plumber())
    .pipe(rename(_config.filename.js))
    .pipe(gulp.dest(`${_config.path.public}/assets/js`))
})

/* js-reload */
gulp.task('js-reload', ['js'], (done) => {
  browserSync.reload()
  done()
})

/* generate css files */
gulp.task('css', () => {
  const plugins = [
    atImport(),
    easings(),
    cssnext(),
  ]
  return gulp
    .src(`${_config.path.src.css}/*.css`)
    .pipe(plumber())
    .pipe(postcss(plugins))
    .pipe(rename(_config.filename.css))
    .pipe(gulp.dest(`${_config.path.public}/assets/css`))
    .pipe(browserSync.stream())
})

/* serve */
gulp.task('serve', ['css'], () => {
  browserSync.init(_config.browserSync)
  gulp.watch(`${_config.path.src.ejs}/**/*.ejs`, ['html-reload'])
  gulp.watch(`${_config.path.src.js}/**/*.js`, ['js-reload'])
  gulp.watch(`${_config.path.src.css}/**/*.css`, ['css'])
})

/* default task */
gulp.task('default', ['html', 'js', 'css', 'serve'])

/* clean */
gulp.task('clean', () => {
  return del(_config.path.dist)
})

/* copy */
gulp.task('copy', () => {
  return gulp
    .src(`${_config.path.public}/**`, {
      base: _config.path.public
    })
    .pipe(gulp.dest(_config.path.dist))
})

/* minify html */
gulp.task('minifyHtml', () => {
  return gulp
    .src(`${_config.path.dist}/**/*.html`)
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(_config.path.dist))
})

/* minify js */
gulp.task('minifyJs', () => {
  return gulp
    .src(`${_config.path.dist}/**/*.js`)
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(gulp.dest(_config.path.dist))
})

/* minify css */
gulp.task('minifyCss', () => {
  return gulp
    .src(`${_config.path.dist}/**/*.css`)
    .pipe(cssmin())
    .pipe(gulp.dest(_config.path.dist))
})

/* build */
gulp.task('build', () => {
  runSequence(
    'clean',
    'copy',
    'minifyHtml',
    'minifyJs',
    'minifyCss'
  )
})
