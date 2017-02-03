const gulp = require('gulp')

const wait = require('gulp-wait')
const mkdirp = require('mkdirp')
const getDirName = require('path').dirname

const request = require('request')
const fs = require('fs')
const argv = require('yargs').argv

const servilo = 'http://overpass-api.de/api/interpreter?data='

let lingvo = 'eo'

function landoj() {
	return '[out:json];node["name:' + lingvo + '"][place=country];out center;'
}
function provincoj() {
	return '[out:json];node["name:' + lingvo + '"][place=state];out center;'
}
function urboj() {
	return '[out:json];node["name:' + lingvo + '"][place=city];out center;'
}
function lokoj() {
	return '[out:json];' +
		'(way["language:' + lingvo + '"];' +
			'way["books:language:' + lingvo + '"];' +
			'node["language:' + lingvo + '"];' +
			'node["books:language:' + lingvo + '"]);' +
		'out tags center;'
}

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

function skribiAlDosiero(path, contents, cb) {
	mkdirp(getDirName(path), function (err) {
		if (err) {
			return cb(err)
		}
		fs.writeFile(path, contents, cb)
	})
}

gulp.task('lingvo', (done) => {
	console.log(argv)
	done()
})

gulp.task('elŝuti:landoj', function() {
	return request(servilo + escape(landoj()), function(error, response, body) {
		let json = simpligiJSON(JSON.parse(body))
		skribiAlDosiero('kunmetaĵo/' + lingvo + '/landoj.json', JSON.stringify(json, null, '\t'))
	}).pipe(wait(5000))
})

gulp.task('elŝuti:provincoj', function() {
	return request(servilo + escape(provincoj()), function(error, response, body) {
		let json = simpligiJSON(JSON.parse(body))
		skribiAlDosiero('kunmetaĵo/' + lingvo + '/provincoj.json', JSON.stringify(json, null, '\t'))
	}).pipe(wait(5000))
})

gulp.task('elŝuti:urboj', function() {
	return request(servilo + escape(urboj()), function(error, response, body) {
		let json = simpligiJSON(JSON.parse(body))
		skribiAlDosiero('kunmetaĵo/' + lingvo + '/urboj.json', JSON.stringify(json, null, '\t'))
	}).pipe(wait(5000))
})

gulp.task('elŝuti:lokoj', function() {
	return request(servilo + escape(lokoj()), function(error, response, body) {
		let json = JSON.parse(body)
		skribiAlDosiero('kunmetaĵo/' + lingvo + '/lokoj.json', JSON.stringify(json, null, '\t'))
	}).pipe(wait(5000))
})
