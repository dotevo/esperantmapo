let mapo;

/**
 * @requires ./tradukilo.js
 * @requires ./ui.js
 * @requires ./overpass/overpass.js
 */

//Parametroj
function tekstoAlTabelo(prmteksto) {
	var parametroj = {}
	var prmtabelo = prmteksto.split('&')
	for (let i = 0; i < prmtabelo.length; i++) {
		let tmptabelo = prmtabelo[i].split('=')
		parametroj[tmptabelo[0]] = tmptabelo[1]
	}
	return parametroj
}

function getSerĉiParametrojn() {
	let prmstr = window.location.search.substr(1)
	return prmstr != null && prmstr != '' ? tekstoAlTabelo(prmstr) : {}
}

var parametroj = getSerĉiParametrojn()
if (parametroj.lat == null || parametroj.lng == null || parametroj.z == null) {
	//console.log(parametroj)
	parametroj.lat = 0
	parametroj.lng = 0
	parametroj.z = 1
}

function ŝanĝiParametrojn() {
	let teksto = ''
	for (let ŝlosilo in parametroj) {
		teksto += ŝlosilo + '=' + parametroj[ŝlosilo] + '&'
	}

	window.history.replaceState('', 'Esperantmapo', '?' + teksto)
}

const LokoIkono = L.Icon.extend({
		options: {
			iconSize:     [32, 37],
			iconAnchor:   [16, 37]
		}
	})
const ikonoj =
	{
		libraro: new LokoIkono({iconUrl: 'bildoj/libraro.png'}),
		stelo: new LokoIkono({iconUrl: 'bildoj/stelo.png'}),
		esperantisto: new LokoIkono({iconUrl: 'bildoj/esperantisto.png'})
	}

function ikononDeLoko(obj) {
	if (obj.tags['office'] == 'ngo' || obj.tags['office'] == 'association') {
		return ikonoj.stelo
	}
	if (obj.tags['books:language:eo'] == 'yes') {
		return ikonoj.libraro
	}
	return ikonoj.esperantisto
}

function manteloj(opt, lingvo) {
	const landojF = new L.OverpassFetcher({
		dosiero: lingvo + '/landoj.json',
		krei: function(objekto) {
			var mia = L.divIcon({
				className: 'etikedo lando-etikedo',
				html: objekto.tags['name:' + lingvo]
			})
			L.marker([objekto.lat, objekto.lon], {icon: mia}).addTo(opt.landoj)
		}
	})

	const provincojF = new L.OverpassFetcher({
		dosiero: lingvo + '/provincoj.json',
		krei: function(objekto) {
			var mia = L.divIcon({
				className: 'etikedo provinco-etikedo',
				html: objekto.tags['name:' + lingvo]
			})
			L.marker([objekto.lat, objekto.lon], {icon: mia}).addTo(opt.provincoj)
		}
	})

	const urbojF = new L.OverpassFetcher({
		dosiero: lingvo + '/urboj.json',
		krei: function(objekto) {
			var mia = L.divIcon({
				className: 'etikedo urbo-etikedo',
				html: objekto.tags['name:' + lingvo]
			})
			L.marker([objekto.lat, objekto.lon], {icon: mia}).addTo(opt.urboj)
		}
	})

	const teroF = new L.OverpassFetcher({
		dosiero: lingvo + '/tero.json',
		krei: function(objekto) {
			var mia = L.divIcon({
				className: 'etikedo tero-etikedo',
				html: objekto.tags['name:' + lingvo]
			})
			L.marker([objekto.lat, objekto.lon], {icon: mia}).addTo(opt.tero)
		}
	})

	const lokojF = new L.OverpassFetcher({
		dosiero: lingvo + '/lokoj.json',
		krei: function(objekto) {
			L.marker([objekto.lat, objekto.lon], {icon: ikononDeLoko(objekto)}).addTo(opt.lokoj)
				.bindPopup(objekto.tags['name'])
		}
	})
}

$(document).bind('pageinit', function() {
	console.log(parametroj)
	if (parametroj.l != null) {
		console.log(parametroj.l)
		$('#landoj').val(parametroj.l).change()
	}
	if (parametroj.p != null) {
		$('#provincoj').val(parametroj.p).change()
	}
	if (parametroj.u != null) {
		$('#urboj').val(parametroj.u).change()
	}
	if (parametroj.t != null) {
		$('#tero').val(parametroj.t).change()
	}
	if (parametroj.lo != null) {
		$('#lokoj').val(parametroj.lo).change()
	}

	mapo = L.map('mapo').setView([parametroj.lat, parametroj.lng], parametroj.z)
	const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
	const teksto = traduki('Datumoj de la mapo {{link}} kontribuantoj',
		{
			'link' : '<a href="http://openstreetmap.org">OpenStreetMap</a>',
			'interpolation': {'escapeValue': false}
		})
	const osm = new L.TileLayer(osmUrl, {maxZoom: 19, opacity: 0.4, attribution: teksto})
	mapo.addLayer(osm)

	const landoj = L.featureGroup().addTo(mapo)
	const urboj = L.featureGroup().addTo(mapo)
	const provincoj = L.featureGroup().addTo(mapo)
	const tero = L.featureGroup().addTo(mapo)
	const lokoj = L.featureGroup().addTo(mapo)

	manteloj({landoj: landoj,
		provincoj: provincoj,
		urboj:urboj,
		tero: tero,
		lokoj: lokoj},
		lingvo)

	mapo.on('moveend', () => {
		parametroj.lat = mapo.getCenter().lat
		parametroj.lng = mapo.getCenter().lng
		parametroj.z = mapo.getZoom()
		ŝanĝiParametrojn()
	})

	mapo.on('zoomend', function() {
		let elektoLandoj = $('#landoj').val()
		if ((mapo.getZoom() < 6 || elektoLandoj === 'C') &&
				elektoLandoj !== 'N') {
			if (!mapo.hasLayer(landoj)) {
				mapo.addLayer(landoj)
			}
		} else {
			mapo.removeLayer(landoj)
		}

		let elektoProvincoj = $('#provincoj').val()
		if ((mapo.getZoom() > 4 || elektoProvincoj === 'C') &&
				elektoProvincoj !== 'N') {
			if (!mapo.hasLayer(provincoj)) {
				mapo.addLayer(provincoj)
			}
		} else {
			mapo.removeLayer(provincoj)
		}

		let elektoTero = $('#tero').val()
		if ((mapo.getZoom() > 4 || elektoTero === 'C') &&
				elektoProvincoj !== 'N') {
			if (!mapo.hasLayer(tero)) {
				mapo.addLayer(tero)
			}
		} else {
			mapo.removeLayer(tero)
		}

		let elektoUrboj = $('#urboj').val()
		if ((mapo.getZoom() > 6 || elektoUrboj === 'C') &&
				elektoUrboj !== 'N') {
			if (!mapo.hasLayer(urboj)) {
				mapo.addLayer(urboj)
			}
		} else {
			mapo.removeLayer(urboj)
		}

		let elektoLokoj = $('#lokoj').val()
		if (elektoLokoj === 'C') {
			if (!mapo.hasLayer(lokoj)) {
				mapo.addLayer(lokoj)
			}
		} else {
			mapo.removeLayer(lokoj)
		}
	})

	$('#landoj, #provincoj, #urboj, #lokoj, #tero').on('change', function () {
		parametroj.l = $('#landoj').val()
		parametroj.p = $('#provincoj').val()
		parametroj.u = $('#urboj').val()
		parametroj.t = $('#tero').val()
		parametroj.lo = $('#lokoj').val()
		mapo.fire('moveend')
		mapo.fire('zoomend')
	})

	mapo.fire('zoomend')

	setInterval(function() {
		$('#reklamujo')[0].contentWindow.location.reload(true)
	}, 60 * 1000)
})
