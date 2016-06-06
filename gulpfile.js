var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    debug = require('gulp-debug'),
    seq = require('run-sequence'),
    jasmine = require('gulp-jasmine'),
    merge = require('merge-stream');

gulp.task('compile', function() {
    var min = gulp.src('src/ndef.js')
        .pipe(uglify())
        .pipe(rename("ndef.min.js"))
        .pipe(gulp.dest('dist'));
    
    var std = gulp.src('src/ndef.js')
        .pipe(rename("ndef.js"))
        .pipe(gulp.dest('dist'));

    return merge(min,std);
});

gulp.task('clean',function() {
    del(['dist/**/*']);
});

gulp.task('lint',function() {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('test:lint',function() {
    return gulp.src('test/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('test:run',function() {
    return gulp.src('test/**/*.js')
        .pipe(jasmine({
            includeStackTrace: true
        }));
});

gulp.task('test', function() {
    seq('test:lint','test:run')    
});

gulp.task('build',function(cb) {
    seq(['lint','clean'],'test','compile',cb);
});

gulp.task('watch',function() {
    gulp.watch(['src/**/*'],['build']);
    gulp.watch(['test/**/*.js'],['test']);
});

gulp.task('default',['build','watch']);
