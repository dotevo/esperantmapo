const gulp = require('gulp')

const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const concat = require('gulp-concat')

const eslint = require('gulp-eslint')
const jscs = require('gulp-jscs')
const stylish = require('gulp-jscs-stylish')

const i18next = require('gulp-i18next-conv')

const dependencies = require('gulp-resolve-dependencies')
const env = require('gulp-env')

const requireDir  = require('require-dir')
requireDir('./gulp')

var jsDosieroj = ['*.js', '**/*.js', '!node_modules/**/*.js',
	'!kunmetaĵo/**/*.js', '!bibliotekoj/**/*.js']

let produkta = false

gulp.task('produkta', () =>
	produkta = true
)

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

gulp.task('js', () => {
	if (produkta === true) {
		env({vars: {BABEL_ENV: 'produkta'}})
	}
	return gulp.src('fontkodo/**/*.js')
		.pipe(dependencies())
		.pipe(sourcemaps.init())
		.pipe(concat('tuta.js'))
		.pipe(babel())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('kunmetaĵo'))
})

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
		.pipe(gulp.dest('kunmetaĵo/internaciigo'))
	return gulp.src('internaciigo/*/nomo')
		.pipe(concat('lingvoj.txt'))
		.pipe(gulp.dest('kunmetaĵo/internaciigo'))
})

gulp.task('bildoj', () =>
	gulp.src('bildoj/*')
			.pipe(gulp.dest('kunmetaĵo/bildoj'))
)

gulp.task('observi', function() {
	produkta = false
	gulp.watch('fontkodo/**/*.js', ['js', 'lint'])
	gulp.watch('fontkodo/**/*.html', ['html', 'lint'])
	gulp.watch('fontkodo/**/*.css', ['css', 'lint'])
	gulp.watch('internaciigo/*/*.po', ['lingvoj', 'lint'])
})

gulp.task('elŝuti', gulp.series('lingvo',
	'elŝuti:landoj', 'elŝuti:provincoj', 'elŝuti:urboj', 'elŝuti:lokoj'))

gulp.task('validigi', gulp.series('lint'))

gulp.task('kompili', gulp.parallel('bildoj', 'bibliotekoj', 'js', 'html', 'css', 'lingvoj'))

gulp.task('produkti', gulp.series('produkta', 'kompili'))
