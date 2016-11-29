const gulp = require('gulp')

const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const concat = require('gulp-concat')

const eslint = require('gulp-eslint')
const jscs = require('gulp-jscs')
const stylish = require('gulp-jscs-stylish')

const i18next = require('gulp-i18next-conv')

var jsDosieroj = ['*.js', '**/*.js', '!node_modules/**/*.js',
	'!kunmetaĵo/**/*.js', '!bibliotekoj/**/*.js']

gulp.task('lint', function() {
	return gulp.src(jsDosieroj)
		.pipe(eslint())
		.pipe(jscs())
		.pipe(stylish())
})

gulp.task('bibliotekoj', () =>
	gulp.src('bibliotekoj/**/*.js')
		.pipe(gulp.dest('kunmetaĵo/bibliotekoj/'))
)

gulp.task('js', () =>
	gulp.src('fontkodo/**/*.js')
		.pipe(sourcemaps.init())
			.pipe(babel({
					presets: ['es2015']
				}))
			.pipe(concat('tuta.js'))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('kunmetaĵo'))
)

gulp.task('html', () =>
	gulp.src('fontkodo/**/*.html')
			.pipe(gulp.dest('kunmetaĵo'))
)

gulp.task('css', () =>
	gulp.src('fontkodo/**/*.css')
			.pipe(gulp.dest('kunmetaĵo'))
)

gulp.task('lingvoj', function() {
	gulp.src('internaciigo/*/*.po')
		.pipe(i18next())
		.pipe(gulp.dest('kunmetaĵo/internaciigo'));
})

gulp.task('validigi', ['lint'], function () {
})

gulp.task('kompili', ['bibliotekoj', 'js', 'html', 'css', 'lingvoj'], function () {
})
