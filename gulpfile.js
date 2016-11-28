const gulp = require('gulp')

const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

const eslint = require('gulp-eslint')
const jscs = require('gulp-jscs')
var stylish = require('gulp-jscs-stylish');

var jsDosieroj = ['*.js', '**/*.js', '!node_modules/**/*.js', '!kunmetaĵo/**/*.js']

gulp.task('lint', function() {
	return gulp.src(jsDosieroj)
		.pipe(eslint())
		.pipe(jscs())
		.pipe(stylish())
});

gulp.task('js', () =>
	gulp.src('fontkodo/**/*.js')
		.pipe(sourcemaps.init())
			.pipe(babel({
					presets: ['es2015']
				}))
			.pipe(concat('tuta.js'))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('kunmetaĵo'))
);

gulp.task('html', () =>
	gulp.src('fontkodo/**/*.html')
			.pipe(gulp.dest('kunmetaĵo'))
);

gulp.task('css', () =>
	gulp.src('fontkodo/**/*.css')
			.pipe(gulp.dest('kunmetaĵo'))
);

gulp.task('validigi', ['lint'], function () {
})

gulp.task('kompili', ['js', 'html', 'css'], function () {
})
