let mapo;

/**
 * @requires ./tradukilo.js
 * @requires ./ui.js
 * @requires ./leaflet-reklamujo.js
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

	mapo = L.map('mapo').setView([parametroj.lat, parametroj.lng], parametroj.z)
	const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
	const teksto = traduki('Datumoj de la mapo {{link}} kontribuantoj',
		{
			'link' : '<a href="http://openstreetmap.org">OpenStreetMap</a>',
			'interpolation': {'escapeValue': false}
		})
	const osm = new L.TileLayer(osmUrl, {maxZoom: 19, opacity: 0.4, attribution: teksto})
	mapo.addLayer(osm)
	new Reklamujo(mapo)

	const landoj = L.featureGroup().addTo(mapo)
	const landojF = new L.OverpassFetcher({
		dosiero: 'landoj.json',
		krei: function(objekto) {
			var mia = L.divIcon({
				className: 'etikedo lando-etikedo',
				html: objekto.tags['name:eo']
			})
			L.marker([objekto.lat, objekto.lon], {icon: mia}).addTo(landoj)
		}
	})

	const provincoj = L.featureGroup().addTo(mapo)
	const provincojF = new L.OverpassFetcher({
		dosiero: 'provincoj.json',
		krei: function(objekto) {
			var mia = L.divIcon({
				className: 'etikedo provinco-etikedo',
				html: objekto.tags['name:eo']
			})
			L.marker([objekto.lat, objekto.lon], {icon: mia}).addTo(provincoj)
		}
	})

	const urboj = L.featureGroup().addTo(mapo)
	const urbojF = new L.OverpassFetcher({
		dosiero: 'urboj.json',
		krei: function(objekto) {
			var mia = L.divIcon({
				className: 'etikedo urbo-etikedo',
				html: objekto.tags['name:eo']
			})
			L.marker([objekto.lat, objekto.lon], {icon: mia}).addTo(urboj)
		}
	})

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
		let elektoUrboj = $('#urboj').val()
		if ((mapo.getZoom() > 6 || elektoUrboj === 'C') &&
				elektoUrboj !== 'N') {
			if (!mapo.hasLayer(urboj)) {
				mapo.addLayer(urboj)
			}
		} else {
			mapo.removeLayer(urboj)
		}
	})

	$('#landoj, #provincoj, #urboj').on('change', function () {
		parametroj.l = $('#landoj').val()
		parametroj.p = $('#provincoj').val()
		parametroj.u = $('#urboj').val()
		mapo.fire('moveend')
		mapo.fire('zoomend')
	})

	mapo.fire('zoomend')
})
