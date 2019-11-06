let mapo;

/**
 * @requires ./tradukilo.js
 * @requires ./ui.js
 * @requires ./overpass/overpass.js
 * @requires ./interpetoj.js
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
if (parametroj.lingvo != null) {
	lingvo = parametroj.lingvo
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
		alia: new LokoIkono({iconUrl: 'bildoj/alia.png'}),
		libraro: new LokoIkono({iconUrl: 'bildoj/libraro.png'}),
		esperanto: new LokoIkono({iconUrl: 'bildoj/esperanto.png'}),
		ngo: new LokoIkono({iconUrl: 'bildoj/ngo.png'}),
		hotelo: new LokoIkono({iconUrl: 'bildoj/hotelo.png'}),
		zamenhof: new LokoIkono({iconUrl: 'bildoj/zamenhof.png'}),
		esperantisto: new LokoIkono({iconUrl: 'bildoj/esperantisto.png'}),
		memoraĵo: new LokoIkono({iconUrl: 'bildoj/memorajxo.png'})
	}

function ikononDeLoko(obj) {
	if (obj.tags['office'] == 'ngo' || obj.tags['office'] == 'association') {
		return ikonoj.ngo
	}
	if (obj.tags['tourism'] == 'hotel' || obj.tags['tourism'] == 'hostel') {
		return ikonoj.hotelo
	}
	if (obj.tags['books:language:eo'] == 'yes') {
		return ikonoj.libraro
	}
	if (obj.tags['historic'] != null) {
		return ikonoj.memoraĵo
	}
	if (obj.tags['name:etymology:wikidata'] == 'Q143') {
		return ikonoj.esperanto
	}
	if (obj.tags['name:etymology:wikidata'] == 'Q11758') {
		return ikonoj.zamenhof
	}
	if (obj.tags['language:eo'] == 'yes') {
		return ikonoj.esperantisto
	}
	return ikonoj.alia
}

function kreiPriskribon(obj) {
	let r = ''
	for (let s in obj.tags) {
		r += '<i>' + s + '</i>  =  <b>' + obj.tags[s] + '</b><br/>'
	}
	return r
}

function eventoEnListo(e) {
	mapo.panTo(new L.LatLng($(this).data('loc-lat'), $(this).data('loc-lon')))
}

function aldoniEnListon(nomo, etikedoj, loc) {
	var btno = $('<a href="#" class="ui-btn ui-shadow ui-corner-all"' +
		'data-loc-lat="' + loc[0] +'" data-loc-lon="' + loc[1] +'" data-filtertext="' +
		etikedoj + '">' + nomo + '</a>')
	var teksto = $('<li></li>')
	teksto.append(btno)
	$('#serĉlisto').append(teksto)
	btno.on('click', eventoEnListo)
}

const OPUrl = 'https://overpass-api.de/api/interpreter?data=';
function vojonOP(interpeto, vojo) {
	if (parametroj.rekte != null) {
		return OPUrl + interpeto;
	} else {
		return vojo;
	}
}

function manteloj(opt, lingvo) {
	const landojF = new L.OverpassFetcher({
		dosiero: vojonOP(escape(landoj(lingvo)), lingvo + '/landoj.json'),
		krei: function(objekto) {
			const nomo = objekto.tags['name:' + lingvo]
			var mia = L.divIcon({
					className: 'etikedo',
					html:
						"<span class='etikedo lando-etikedo'>" +
						nomo +
						"</span>"
				})
			aldoniEnListon(nomo, '', [objekto.lat, objekto.lon])
			opt.landoj.addLayer(L.marker([objekto.lat, objekto.lon], {icon: mia}))
		}
	})

	const provincojF = new L.OverpassFetcher({
		dosiero: vojonOP(escape(provincoj(lingvo)), lingvo + '/provincoj.json'),
		krei: function(objekto) {
			const nomo = objekto.tags['name:' + lingvo]
			var mia = L.divIcon({
					className: 'etikedo',
					html:
						"<span class='etikedo provinco-etikedo'>" +
						nomo +
						"</span>"
				})
			aldoniEnListon(nomo, '', [objekto.lat, objekto.lon])
			L.marker([objekto.lat, objekto.lon], {icon: mia}).addTo(opt.provincoj)
		}
	})

	const urbojF = new L.OverpassFetcher({
		dosiero: vojonOP(escape(urboj(lingvo)), lingvo + '/urboj.json'),
		krei: function(objekto) {
			const nomo = objekto.tags['name:' + lingvo]
			var mia = L.divIcon({
					className: 'etikedo',
					html:
						"<span class='etikedo urbo-etikedo'>" +
						nomo +
						"</span>"
				})
			aldoniEnListon(nomo, '', [objekto.lat, objekto.lon])
			opt.urboj.addLayer(L.marker([objekto.lat, objekto.lon], {icon: mia}))
		}
	})

	const teroF = new L.OverpassFetcher({
		dosiero: vojonOP(escape(tero(lingvo)), lingvo + '/tero.json'),
		krei: function(objekto) {
			const nomo = objekto.tags['name:' + lingvo]
			var mia = L.divIcon({
					className: 'etikedo',
					html:
						"<span class='etikedo urbo-etikedo'>" +
						nomo +
						"</span>"
				})
			aldoniEnListon(nomo, '', [objekto.lat, objekto.lon])
			opt.tero.addLayer(L.marker([objekto.lat, objekto.lon], {icon: mia}))
		}
	})

	const lokojF = new L.OverpassFetcher({
		dosiero: vojonOP(escape(lokoj(lingvo)), lingvo + '/lokoj.json'),
		krei: function(objekto) {
			L.marker([objekto.lat, objekto.lon], {icon: ikononDeLoko(objekto)}).addTo(opt.lokoj)
				.bindPopup(kreiPriskribon(objekto))
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

	const landoj = L.LayerGroup.collision({margin:5})
	const urboj = L.LayerGroup.collision({margin:5})
	const provincoj = L.featureGroup()//L.LayerGroup.collision({margin:5})
	const tero = L.featureGroup()//L.LayerGroup.collision({margin:5})
	const lokoj = L.featureGroup()//.addTo(mapo)

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
			console.log("Al: landoj")
		} else {
			console.log("For: landoj")
			if (mapo.hasLayer(landoj)) {
				mapo.removeLayer(landoj)
			}
		}

		let elektoProvincoj = $('#provincoj').val()
		if ((mapo.getZoom() > 4 || elektoProvincoj === 'C') &&
				elektoProvincoj !== 'N') {
			if (!mapo.hasLayer(provincoj)) {
				mapo.addLayer(provincoj)
			}
			console.log("Al: provincoj")

		} else {
			console.log("For: provincoj")
			if (mapo.hasLayer(provincoj)) {
				mapo.removeLayer(provincoj)
			}
		}

		let elektoTero = $('#tero').val()
		if ((mapo.getZoom() > 4 || elektoTero === 'C') &&
				elektoTero !== 'N') {
			if (!mapo.hasLayer(tero)) {
				mapo.addLayer(tero)
			}
			console.log("Al: tero")

		} else {
			console.log("For: tero")
			if (mapo.hasLayer(tero)) {
				mapo.removeLayer(tero)
			}
		}

		let elektoUrboj = $('#urboj').val()
		if ((mapo.getZoom() > 6 || elektoUrboj === 'C') &&
				elektoUrboj !== 'N') {
			if (!mapo.hasLayer(urboj)) {
				mapo.addLayer(urboj)
			}
			console.log("Al: urboj")
		} else {
			console.log("For: urboj")
			if (mapo.hasLayer(urboj)) {
				mapo.removeLayer(urboj)
			}
		}

		let elektoLokoj = $('#lokoj').val()
		if ((mapo.getZoom() > 4 || elektoLokoj === 'C') &&
			elektoLokoj !== 'N') {
			if (!mapo.hasLayer(lokoj)) {
				mapo.addLayer(lokoj)
			}
			console.log("Al: lokoj")

		} else {
			console.log("For: lokoj")
			if (mapo.hasLayer(lokoj)) {
				mapo.removeLayer(lokoj)
			}
		}

		console.log("Lokoj: " + mapo.hasLayer(lokoj))
		console.log("Urboj: " + mapo.hasLayer(urboj))
		console.log("Provincoj: " + mapo.hasLayer(provincoj))
		console.log("Landoj: " + mapo.hasLayer(landoj))
		console.log("Tero: " + mapo.hasLayer(tero))
		console.log(landoj)
		console.log(urboj)

	})

	$('#landoj, #provincoj, #urboj, #lokoj, #tero').on('change', function () {
		console.log("AA");
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
