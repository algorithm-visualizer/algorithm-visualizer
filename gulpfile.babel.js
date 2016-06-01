'use strict';

import path from 'path';
import gulp from 'gulp';
import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import header from 'gulp-header';
import babel from 'gulp-babel';
import gutil from 'gulp-util';
import sourcemaps from 'gulp-sourcemaps';
import connect from 'gulp-connect';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import pkg from './package.json';

const appName = 'algorithm_visualizer';
const appEntryPoint = './js/index.js';

const outputPaths = {
  javascript: './public',
  css: './public',
  sourceMaps: './'
};

const banner = [
  '/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @author <%= pkg.author %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''
].join('\n');

// build directories

const cssDir = path.join(__dirname, 'css', '**', '*.css');
const jsDir = path.join(__dirname, 'js', '**', '*.js');

// CSS

gulp.task('minify-css', () => {
  gutil.log('\n\nBuild CSS Paths: \n', cssDir, '\n\n');

  return gulp.src(cssDir)
    .pipe(autoprefixer())
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(concat(`${appName}.min.css`))
    .pipe(header(banner, {
      pkg
    }))
    .pipe(gulp.dest(outputPaths.css))
    .pipe(connect.reload());
});

gulp.task('build-css', () => {
  gutil.log('\n\nBuild CSS Paths: \n', cssDir, '\n\n');

  return gulp.src(cssDir)
    .pipe(autoprefixer())
    .pipe(concat(`${appName}.css`))
    .pipe(header(banner, {
      pkg
    }))
    .pipe(gulp.dest(outputPaths.css))
    .pipe(connect.reload());
});

// JS

gulp.task('minify-js', () => {

  gutil.log('\n\nBuild JS Paths: \n', jsDir, '\n\n');

  return browserify({
      entries: './js/index.js',
      debug: true
    })
    .transform('babelify', {
      presets: ['es2015']
    })
    .bundle()
    .pipe(source(`${appName}.min.js`))
    .pipe(header(banner, {
      pkg
    }))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write(outputPaths.sourceMaps))
    .pipe(gulp.dest(outputPaths.javascript))
    .pipe(connect.reload());

});

gulp.task('build-js', () => {

  gutil.log('\n\nBuild JS Paths: \n', jsDir, '\n\n');

  return browserify({
      entries: './js/index.js',
      debug: true
    })
    .transform('babelify', {
      presets: ['es2015']
    })
    .bundle()
    .pipe(source(`${appName}.js`))
    .pipe(header(banner, {
      pkg
    }))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write(outputPaths.sourceMaps))
    .pipe(gulp.dest(outputPaths.javascript))
    .pipe(connect.reload());
});

// Build

gulp.task('compile-css', ['build-css', 'minify-css']);
gulp.task('compile-js', ['build-js', 'minify-js']);
gulp.task('build', ['compile-css', 'compile-js']);

// Server

gulp.task('connect', function() {

  connect.server({
    livereload: true
  });
});

// Watch

gulp.task('watch', ['build'], function() {
  gulp.watch(jsDir, ['compile-js']);
  gulp.watch(cssDir, ['compile-css']);
});

// Default

gulp.task('default', ['connect', 'watch']);