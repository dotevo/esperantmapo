const gulp = require('gulp')

const wait = require('gulp-wait')
const mkdirp = require('mkdirp')
const getDirName = require('path').dirname

const request = require('request')
const fs = require('fs')
const argv = require('yargs').argv

//const servilo = 'http://overpass-api.de/api/interpreter?data='
const servilo = 'http://overpass.osm.rambler.ru/cgi/interpreter?data='

let lingvo = 'eo'

function landoj() {
	return '[out:json];node["name:' + lingvo + '"][place=country];out center;'
}
function provincoj() {
	return '[out:json];node["name:' + lingvo + '"][place~"state|region"];out center;'
}
function urboj() {
	return '[out:json];node["name:' + lingvo + '"][place~"city|town|suburb"];out center;'
}
function tero() {
	return '[out:json];(' +
		'node["place"="island"]["name:' + lingvo + '"];' +
		'way["place"="island"]["name:' + lingvo + '"];' +
		'relation["place"="island"]["name:' + lingvo + '"];' +
		');out center body;'
}

function lokoj() {
	return '[out:json];' +
		'(way["language:' + lingvo + '"];' +
			'way["books:language:' + lingvo + '"];' +
			'node["language:' + lingvo + '"];' +
			'node["books:language:' + lingvo + '"];' +
			((lingvo == 'eo') ?
			'node["esperanto"="yes"];' +
			'way["esperanto"="yes"];' +
			'node["name:etymology:wikidata"="Q143"];' +
			'way["name:etymology:wikidata"="Q143"];' +
			'node["name:etymology:wikidata"="Q11758"];' +
			'way["name:etymology:wikidata"="Q11758"];'
			: '') +
		');out tags center;'
}

function simpligiObjekton(obj) {
	let objekto = {}
	objekto.type = obj.type
	objekto.id = obj.id
	objekto.lat = obj.lat
	objekto.lon = obj.lon
	objekto.center = obj.center
	objekto.tags = {}
	objekto.tags['name:' + lingvo] = obj.tags['name:' + lingvo]
	if (obj.tags.hasOwnProperty('alt_name:' + lingvo))
		objekto.tags['alt_name:' + lingvo] = obj.tags['alt_name:' + lingvo]
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

const templimo = 1000;

gulp.task('lingvo', function(done) {
	if (argv.lingvo != null) {
		lingvo = argv.lingvo
	}
	console.log('Uzas: ' + lingvo)
	done()
})

gulp.task('elŝuti:landoj', gulp.series('lingvo', function() {
	return request(servilo + escape(landoj()), function(error, response, body) {
		try {
			let json = simpligiJSON(JSON.parse(body))
			skribiAlDosiero('kunmetaĵo/' + lingvo + '/landoj.json', JSON.stringify(json, null, '\t'))
		} catch (err) {
			console.log('ERROR %s', err)
			console.log(body)
		}
	}).pipe(wait(templimo))
}))

gulp.task('elŝuti:provincoj', gulp.series('lingvo', function() {
	return request(servilo + escape(provincoj()), function(error, response, body) {
		try {
			let json = simpligiJSON(JSON.parse(body))
			skribiAlDosiero('kunmetaĵo/' + lingvo + '/provincoj.json', JSON.stringify(json, null, '\t'))
		} catch (err) {
			console.log('ERROR %s', err)
			console.log(body)
		}
	}).pipe(wait(templimo))
}))

gulp.task('elŝuti:urboj', gulp.series('lingvo', function() {
	return request(servilo + escape(urboj()), function(error, response, body) {
		try {
			let json = simpligiJSON(JSON.parse(body))
			skribiAlDosiero('kunmetaĵo/' + lingvo + '/urboj.json', JSON.stringify(json, null, '\t'))
		} catch (err) {
			console.log('ERROR %s', err)
			console.log(body)
		}
	}).pipe(wait(templimo))
}))

gulp.task('elŝuti:tero', gulp.series('lingvo', function() {
	return request(servilo + escape(tero()), function(error, response, body) {
		try {
			let json = simpligiJSON(JSON.parse(body))
			skribiAlDosiero('kunmetaĵo/' + lingvo + '/tero.json', JSON.stringify(json, null, '\t'))
		} catch (err) {
			console.log('ERROR %s', err)
			console.log(body)
		}
	}).pipe(wait(templimo))
}))

gulp.task('elŝuti:lokoj', gulp.series('lingvo', function() {
	return request(servilo + escape(lokoj()), function(error, response, body) {
		try {
			let json = JSON.parse(body)
			skribiAlDosiero('kunmetaĵo/' + lingvo + '/lokoj.json', JSON.stringify(json, null, '\t'))
		} catch (err) {
			console.log('ERROR %s', err)
			console.log(body)
		}
	}).pipe(wait(templimo))
}))
