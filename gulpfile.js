const gulp = require('gulp');
const del = require('del');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');
const cssmin = require('gulp-cssmin');

const options = {
  SRC_PATH: './src',
  PUBLIC_PATH: './public',
  BUILD_PATH: './dist',
  AUTOPREFIXER: {
    browsers: ['last 2 versions'],
    cascade: false
  },
  BROWSERSYNC: {
    open: false,
    server: './public',
    port: 3000,
    ghostMode: false,
    notify: false,
  },
  WEBPACK: {
    entry: {
      'common': './src/js/entries/common.js',
      'top': './src/js/entries/top.js',
    },
    output: {
      filename: '[name].js'
    },
    resolve: {
      extensions: ['.js', '.css']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: ['babel-loader', 'eslint-loader'],
          exclude: /node_modules/
        },
      ]
    }
  },
  MINIFY_JS: true,
  MINIFY_CSS: true,
};

gulp.task('html-reload', ['html'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('js', () => {
  return gulp.src(`${options.SRC_PATH}/js/entries/**/*.js`)
    .pipe(plumber())
    .pipe(webpack(Object.assign({}, options.WEBPACK, { mode: 'development' })))
    .pipe(gulp.dest(`${options.PUBLIC_PATH}/assets/js`));
});

gulp.task('js-reload', ['js'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('scss', () => {
  return gulp.src(`${options.SRC_PATH}/scss/entries/**/*.scss`)
    .pipe(sassGlob())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer(options.AUTOPREFIXER))
    .pipe(gulp.dest(`${options.PUBLIC_PATH}/assets/css`))
    .pipe(browserSync.stream());
});

gulp.task('watch', () => {
  watch([`${options.SRC_PATH}/**/*.html`], () => {
    return gulp.start(['html-reload']);
  });
  watch([`${options.SRC_PATH}/js/**/*.js`], () => {
    return gulp.start(['js-reload']);
  });
  watch([`${options.SRC_PATH}/scss/**/*.scss`], () => {
    return gulp.start(['scss']);
  });
  browserSync.init(options.BROWSERSYNC);
});

gulp.task('default', () => {
  runSequence(
    'scss',
    'js',
    'watch'
  );
});

gulp.task('clean', () => {
  return del([
    options.BUILD_PATH
  ]);
});

gulp.task('copy', () => {
  return gulp
    .src(`${options.PUBLIC_PATH}/**`, {
      base: options.PUBLIC_PATH
    })
    .pipe(gulp.dest(options.BUILD_PATH));
});

gulp.task('minify:js', () => {
  if (options.MINIFY_JS) {
    return gulp.src(`${options.BUILD_PATH}/assets/js/**/*.js`)
      .pipe(plumber())
      .pipe(webpack(Object.assign({}, options.WEBPACK, { mode: 'production' })))
      .pipe(gulp.dest(`${options.BUILD_PATH}/assets/js`));
  }
});

gulp.task('minify:css', () => {
  if (options.MINIFY_CSS) {
    return gulp
      .src(`${options.BUILD_PATH}/assets/css/**/*.css`)
      .pipe(cssmin())
      .pipe(gulp.dest(`${options.BUILD_PATH}/assets/css`));
  }
});

gulp.task('build', () => {
  runSequence(
    'clean',
    'copy',
    'minify:js',
    'minify:css'
  );
});
