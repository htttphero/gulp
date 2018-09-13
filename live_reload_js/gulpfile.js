const gulp = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const uglify = require("gulp-uglify");


const isDevelopment = true;/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



gulp.task('less', function () {
    return gulp.src('src/less/**/*.less')
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(autoprefixer())
        .pipe(less())
        .pipe(concat('bundle.css'))
        .pipe( gulpIf(isDevelopment,cleanCss()))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(gulp.dest('public'))
        .pipe(browserSync.stream());
});


gulp.task("scripts", function() {
    return gulp.src("src/js/*.js") // директория откуда брать исходники
        .pipe(sourcemaps.init())
        .pipe(concat('bundleJS.js')) // объеденим все js-файлы в один 
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify()) // вызов плагина uglify - сжатие кода
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("public")) // директория продакшена, т.е. куда сложить готовый файл
        .pipe(browserSync.stream());
});


gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: './public'
        }
    });
	
    gulp.watch("src/js/*.js", ["scripts"]);
    gulp.watch('src/less/**/*.less', ['less']);
    gulp.watch('public/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['less','scripts',  'serve']);