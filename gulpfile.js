'use strict';

var projectName		= __dirname.split('/')[__dirname.split('/').length-3];

var gulp			= require('gulp');
var sass			= require('gulp-sass');
var copy			= require('gulp-copy');
var path			= require('path');
var tinypng			= require('gulp-tinypng');
var concat			= require('gulp-concat');
var minify			= require('gulp-minifier');
var clean 			= require('gulp-clean');
var autoprefixer 	= require('gulp-autoprefixer');
var browserSync		= require('browser-sync').create();

gulp.task('clean', function() {
	return 	gulp.src('./build', {read: false})
			.pipe(clean());
});

gulp.task('sync', ['clean'], function () {
	return 	gulp.src(['./source/**', '!./source/plugins', '!./source/plugins/**', '!./source/stylesheets/**', '!./source/scripts/**'], {dot: true})
			.pipe(gulp.dest('./build'));
});

gulp.task('sass', ['sync'], function () {
	return 	gulp.src('./source/stylesheets/master.scss')
			.pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
			.pipe(gulp.dest('./build/stylesheets'));
});

gulp.task('fonts', ['sync'], function () {
	return 	gulp.src('./source/fonts/*')
	  		.pipe(copy('./build/fonts', {prefix: 2}));
});

gulp.task('images', ['sync'], function () {
	return 	gulp.src(['./source/images/*.jpg', './source/images/*.png'])
	        .pipe(tinypng('w2lWbNviXvf2vp4OhLKNUOsexrAd0x-R'))
	        .pipe(gulp.dest('./build/images'));
});

gulp.task('plugins', ['sync'], function () {
	return 	gulp.src([
				'./source/plugins/jquery/dist/jquery.min.js'
			])
	        .pipe(concat('plugins.js'))
	        .pipe(gulp.dest('./build/scripts'));
});

gulp.task('scripts', ['plugins'], function () {
	return 	gulp.src([
				'./source/scripts/functions.js'
			])
	        .pipe(concat('functions.js'))
	        .pipe(gulp.dest('./build/scripts'));
});

gulp.task('stylesheets', ['sass'], function () {
	return 	gulp.src([
				'./build/stylesheets/master.css'
			])
	        .pipe(concat('master.css'))
			.pipe(autoprefixer({
		            browsers: ['last 2 versions'],
		            cascade: false
			}))
	        .pipe(gulp.dest('./build/stylesheets'));
});

gulp.task('minify-css', ['stylesheets'], function () {
	return	gulp.src('./build/stylesheets/master.css')
			.pipe(minify({
				minify: true,
				collapseWhitespace: true,
				conservativeCollapse: true,
				minifyJS: true,
				minifyCSS: true,
			}))
			.pipe(gulp.dest('./build/stylesheets'));
});

gulp.task('minify-js', ['scripts'], function () {
	return	gulp.src('./build/scripts/*')
			.pipe(minify({
				minify: true,
				collapseWhitespace: true,
				conservativeCollapse: true,
				minifyJS: true,
				minifyCSS: true,
			}))
			.pipe(gulp.dest('./build/scripts'));
});

gulp.task('watch', ['default'], function() {
    browserSync.init({
		proxy: "localhost/"+projectName
	});
    gulp.watch("./source/**/*.scss", ['default']);
    gulp.watch("./source/**/*.php", ['default']);
	gulp.watch("./source/**/*.js", ['default']);
});

gulp.task('default', ['sass', 'plugins', 'scripts', 'stylesheets', 'sync', 'fonts'], function (done) {
	browserSync.reload();
    done();
});

gulp.task('build', ['default', 'minify-css', 'minify-js']);
gulp.task('build:image', ['default', 'images', 'minify-css', 'minify-js']);
