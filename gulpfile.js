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

const request = require('request')
const fs = require('fs')

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
	gulp.src('fontkodo/**/*.js')
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
	gulp.src('internaciigo/*/nomo')
		.pipe(concat('lingvoj.txt'))
		.pipe(gulp.dest('kunmetaĵo/internaciigo'))
})

gulp.task('observi', function() {
	produkta = false
	gulp.watch('fontkodo/**/*.js', ['js', 'lint'])
	gulp.watch('fontkodo/**/*.html', ['html', 'lint'])
	gulp.watch('fontkodo/**/*.css', ['css', 'lint'])
	gulp.watch('internaciigo/*/*.po', ['lingvoj', 'lint'])
})

const servilo = 'http://overpass-api.de/api/interpreter?data='

function simpligiObjekton(obj) {
	let objekto = {}
	objekto.type = obj.type
	objekto.id = obj.id
	objekto.lat = obj.lat
	objekto.lon = obj.lon
	objekto.center = obj.center
	objekto.tags = {}
	objekto.tags['name:eo'] = obj.tags['name:eo']

	return objekto
}

function simpligiJSON(json) {
	let re = {}
	re.version = json.version
	re.generator = json.generator
	re.osm3s = json.osm3s
	re.elements = []
	for (let i in json.elements) {
		re.elements.push(simpligiObjekton(json.elements[i]))
	}
	return re
}

const landoj = '[out:json];node["name:eo"][place=country];out center;'
const provincoj = '[out:json];node["name:eo"][place=state];out center;'
const urboj = '[out:json];node["name:eo"][place=city];out center;'

gulp.task('elŝuti:landoj', function() {
	return request(servilo + escape(landoj), function(error, response, body) {
		let json = simpligiJSON(JSON.parse(body))
		fs.writeFile('kunmetaĵo/landoj.json', JSON.stringify(json))
	})
})

gulp.task('elŝuti:provincoj', function() {
	return request(servilo + escape(provincoj), function(error, response, body) {
		let json = simpligiJSON(JSON.parse(body))
		fs.writeFile('kunmetaĵo/provincoj.json', JSON.stringify(json))
	})
})

gulp.task('elŝuti:urboj', function() {
	return request(servilo + escape(urboj), function(error, response, body) {
		let json = simpligiJSON(JSON.parse(body))
		fs.writeFile('kunmetaĵo/urboj.json', JSON.stringify(json))
	})
})

gulp.task('elŝuti', ['elŝuti:landoj','elŝuti:provincoj'], function() {
})

gulp.task('validigi', ['lint'], function () {
})

gulp.task('kompili', ['bibliotekoj', 'js', 'html', 'css', 'lingvoj'], function () {
})

gulp.task('produkti', ['produkta', 'kompili'], function () {
})
