const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const pump = require('pump');
// const uglify = require('gulp-uglify');
// const babel = require('gulp-babel');
const svgmin = require('gulp-svgmin');

gulp.task('svgmin', () =>
  gulp
    .src('src/images/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('build/images')));

gulp.task('compress', (cb) => {
  pump(
    [gulp.src('src/scripts/app.js'),
      // babel({ presets: ['env'] }),
      // uglify({ output: { quote_style: 1 } }),
      rename({ suffix: '-min' }),
      gulp.dest('build/scripts')],
    cb,
  );
});

// Compile Sass
gulp.task('sass', () =>
  gulp
    .src(['src/scss/*.scss'])
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(gulp.dest('build/styles')));

// Watch
gulp.task('watch-css-js', ['sass', 'compress'], () => {
  gulp.watch(['src/scss/*.scss'], ['sass']);
  gulp.watch(['src/scripts/*.js'], ['compress']);
});

// Default
gulp.task('default', ['watch-css-js']);
