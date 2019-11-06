'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function landoj(lingvo) {
	return '[out:json];node["name:' + lingvo + '"][place=country];out center;';
}
function provincoj(lingvo) {
	return '[out:json];node["name:' + lingvo + '"][place~"state|region"];out center;';
}
function urboj(lingvo) {
	return '[out:json];node["name:' + lingvo + '"][place~"city|town|suburb"];out center;';
}
function tero(lingvo) {
	return '[out:json];(' + 'node["place"="island"]["name:' + lingvo + '"];' + 'way["place"="island"]["name:' + lingvo + '"];' + 'relation["place"="island"]["name:' + lingvo + '"];' + ');out center body;';
}

function lokoj(lingvo) {
	return '[out:json];' + '(way["language:' + lingvo + '"];' + 'way["books:language:' + lingvo + '"];' + 'node["language:' + lingvo + '"];' + 'node["books:language:' + lingvo + '"];' + (lingvo == 'eo' ? 'node["esperanto"="yes"];' + 'way["esperanto"="yes"];' + 'node["name:etymology:wikidata"="Q143"];' + 'way["name:etymology:wikidata"="Q143"];' + 'node["name:etymology:wikidata"="Q11758"];' + 'way["name:etymology:wikidata"="Q11758"];' : '') + ');out tags center;';
}
var Ujo = L.Control.extend({ options: { position: 'bottomleft' },
	setText: function setText(html) {
		this.controlDiv.innerHTML = html;
	},
	onAdd: function onAdd(mapo) {
		this.controlDiv = L.DomUtil.create('div', 'leaflet-control-fenestro leaflet-control-mesaĝo');
		return this.controlDiv;
	}
});

i18next.use(i18nextXHRBackend);

function escapeHtml(objekto) {
	if (objekto.replace === undefined) {
		objekto = JSON.stringify(objekto);
	}
	return objekto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function traduki(teksto, opcioj) {
	var datumoj = '';
	if (opcioj !== undefined) {
		datumoj = ' data-i18n-opcioj="' + escapeHtml(opcioj) + '"';
	}
	return '<span data-i18n="' + teksto + '" ' + datumoj + '>' + '</span>';
}

var Tradukilo = function () {
	function Tradukilo() {
		_classCallCheck(this, Tradukilo);

		var ĉi = this;
		$.get('internaciigo/lingvoj.txt', function (datumoj) {
			var lingvoj = {};
			var linio = datumoj.split(/\n/);
			for (var n = 0; n < linio.length; ++n) {
				if (linio[n].length > 0) {
					var x = linio[n].split(':');
					lingvoj[x[0]] = x[1];
				}
			}
			ĉi.lingvoj = lingvoj;

			//I18NEXT
			i18next.init({
				debug: true,
				lng: 'eo',
				ns: ['traduko', 'leaflet'],
				defaultNS: 'traduko',
				fallbackLng: 'eo',
				saveMissing: true,
				backend: {
					loadPath: 'internaciigo/{{lng}}/{{ns}}.json',
					addPath: 'internaciigo/{{lng}}/{{ns}}.json'
				}
			}, ĉi.i18nextPretas.bind(ĉi));
		});
	}

	_createClass(Tradukilo, [{
		key: 'akiriLingvon',
		value: function akiriLingvon() {
			return i18next.language;
		}
	}, {
		key: 'i18nextPretas',
		value: function i18nextPretas() {
			var ĉi = this;
			this.tradukiLeaflet();
			this.tradukiPaĝon();
			i18next.on('languageChanged', function (lng) {});
			jqueryI18next.init(i18next, $);
			$(document).trigger('i18nextPretas', ĉi.lingvoj);
		}
	}, {
		key: 'tradukiLeaflet',
		value: function tradukiLeaflet() {
			$('#mapo [title]').each(function (index) {
				$(this).attr('title', i18next.t($(this).attr('aria-label'), { ns: 'leaflet' }));
			});
		}
	}, {
		key: 'tradukiPa\u011Don',
		value: function tradukiPaOn() {
			$('[data-i18n]').each(function (index) {
				var teksto = $(this).attr('data-i18n-opcioj');

				var opcioj = '';
				if (teksto !== undefined) {
					opcioj = JSON.parse(teksto);
				}
				$(this).html(i18next.t($(this).attr('data-i18n'), opcioj));
			});
			$('select').selectmenu('refresh', true);
		}
	}, {
		key: '\u015Dan\u011DiLingvon',
		value: function anILingvon(lingvo) {
			var ĉi = this;
			i18next.changeLanguage(lingvo, function (err, t) {
				ĉi.tradukiLeaflet();
				ĉi.tradukiPaĝon();
			});
		}
	}]);

	return Tradukilo;
}();

var tradukilo = new Tradukilo();

/**
 * @requires ./tradukilo.js
 */

$(document).bind('mobileinit', function () {
	$.mobile.ajaxEnabled = false;
	$.mobile.hashListeningEnabled = false;
	$.mobile.pushStateEnabled = false;
});

$(document).on('pagecontainershow', function () {
	SkaliEnhavon();
	$(window).on('resize orientationchange', function () {
		SkaliEnhavon();
	});
	mapo.invalidateSize();
});

function SkaliEnhavon() {
	scroll(0, 0);
	var enhavo = $.mobile.getScreenHeight() - $('.ui-paĝokapo').outerHeight() - $('.ui-paĝopiedo').outerHeight() - $('.ui-enhavo').outerHeight() + $('.ui-enhavo').height();
	$('.ui-enhavo').height(enhavo);
}

$(document).on('i18nextPretas', function (evento, lingvoj) {
	var select = $('#lingvoj');
	for (var lingvo in lingvoj) {
		var opt = '<option class="lingvo" id="' + lingvo + '" value="' + lingvo + '">' + lingvoj[lingvo] + '</option>';
		select.append(opt);
	}
	console.log(tradukilo.akiriLingvon());
	var selected = select.find('#' + tradukilo.akiriLingvon());
	selected.attr('selected', 'selected');
	select.selectmenu();
	select.selectmenu('refresh', true);
	select.on('change', function () {
		var lingvo = this.value;
		tradukilo.ŝanĝiLingvon(lingvo);
	});
});

var OverpassVico = function () {
	function OverpassVico(opcioj) {
		_classCallCheck(this, OverpassVico);

		this.opcioj = {
			url: 'http://overpass-api.de/api/interpreter?data=',
			surŜarga: function surArga() {
				console.log('Ŝarga');
			},
			surKompletigita: function surKompletigita() {
				console.log('Kompletigita');
			}
		};

		$.extend(this.opcioj, opcioj);
		this.overpassInformpetoj = [];
		this.overpassHalto = true;
	}

	_createClass(OverpassVico, [{
		key: 'komenciInformpeton',
		value: function komenciInformpeton() {
			this.overpassHalto = false;
			var informpeto = this.overpassInformpetoj.pop();
			console.log(informpeto.url);
			var ĉi = this;
			$.ajax({
				url: this.opcioj.url + informpeto.url,
				crossDomain: true,
				dataType: 'json',
				data: {}
			}).always(function (a, b) {
				if (ĉi.overpassInformpetoj.length > 0) {
					ĉi.komenciInformpeton();
				} else {
					ĉi.overpassHalto = true;
					ĉi.opcioj.surKompletigita();
				}
				informpeto.revoko(a);
			});
		}
	}, {
		key: 'el\u015DutiElOverpass',
		value: function elUtiElOverpass(url, revoko) {
			this.overpassInformpetoj.push({ 'url': url, 'revoko': revoko });
			if (this.overpassInformpetoj.length == 1 && this.overpassHalto == true) {
				this.opcioj.surŜarga();
				this.komenciInformpeton();
			}
		}
	}]);

	return OverpassVico;
}();

//let overpassVico = new OverpassVico({})

//var url = '[out:json];node["name:eo"]["admin_level"="2"];out center;'
//overpassVico.elŝutiElOverpass(escape(url), function(a, b) {
//	console.log(a)
//})

L.LatLngBounds.prototype.limigaKesto = function () {
	var a = this._southWest,
	    b = this._northEast;
	return [Math.round(a.lat * 1000) / 1000 + 0.0001, Math.round(a.lng * 1000) / 1000 + 0.0001, Math.round(b.lat * 1000) / 1000 - 0.0001, Math.round(b.lng * 1000) / 1000 - 0.0001].join(',');
};

/**
 * @requires ./vico.js
 */

var overpassVico = new OverpassVico({ url: '' });

L.OverpassFetcher = L.LayerGroup.extend({
	options: {
		dosiero: 'datumo.json',
		krei: function krei() {}
	},
	initialize: function initialize(options) {
		L.Util.setOptions(this, options);
		var ĉi = this;
		this._nodes = {};

		console.log(this.options.dosiero);
		overpassVico.elŝutiElOverpass(this.options.dosiero, function (a, b) {
			ĉi.analizi(a);
		});
	},
	analizi: function analizi(data) {
		if (data.responseJSON != undefined && data.responseJSON.elements != undefined) {
			data = data.responseJSON;
		}
		if (data.elements === undefined) {
			console.log(data);
			return;
		}

		for (var key in data.elements) {
			var el = data.elements[key];
			if (el.center != null) {
				el.lat = el.center.lat;
				el.lon = el.center.lon;
			}
			this.options.krei(el);
		}
	}
});

L.overpassFetcher = function (layers) {
	return new L.OverpassFetcher(layers);
};

var mapo = void 0;

/**
 * @requires ./tradukilo.js
 * @requires ./ui.js
 * @requires ./overpass/overpass.js
 * @requires ./interpetoj.js
 */

//Parametroj
function tekstoAlTabelo(prmteksto) {
	var parametroj = {};
	var prmtabelo = prmteksto.split('&');
	for (var i = 0; i < prmtabelo.length; i++) {
		var tmptabelo = prmtabelo[i].split('=');
		parametroj[tmptabelo[0]] = tmptabelo[1];
	}
	return parametroj;
}

function getSerĉiParametrojn() {
	var prmstr = window.location.search.substr(1);
	return prmstr != null && prmstr != '' ? tekstoAlTabelo(prmstr) : {};
}

var parametroj = getSerĉiParametrojn();
if (parametroj.lat == null || parametroj.lng == null || parametroj.z == null) {
	//console.log(parametroj)
	parametroj.lat = 0;
	parametroj.lng = 0;
	parametroj.z = 1;
}
if (parametroj.lingvo != null) {
	lingvo = parametroj.lingvo;
}

function ŝanĝiParametrojn() {
	var teksto = '';
	for (var ŝlosilo in parametroj) {
		teksto += ŝlosilo + '=' + parametroj[ŝlosilo] + '&';
	}

	window.history.replaceState('', 'Esperantmapo', '?' + teksto);
}

var LokoIkono = L.Icon.extend({
	options: {
		iconSize: [32, 37],
		iconAnchor: [16, 37]
	}
});
var ikonoj = {
	alia: new LokoIkono({ iconUrl: 'bildoj/alia.png' }),
	libraro: new LokoIkono({ iconUrl: 'bildoj/libraro.png' }),
	esperanto: new LokoIkono({ iconUrl: 'bildoj/esperanto.png' }),
	ngo: new LokoIkono({ iconUrl: 'bildoj/ngo.png' }),
	hotelo: new LokoIkono({ iconUrl: 'bildoj/hotelo.png' }),
	zamenhof: new LokoIkono({ iconUrl: 'bildoj/zamenhof.png' }),
	esperantisto: new LokoIkono({ iconUrl: 'bildoj/esperantisto.png' }),
	memoraĵo: new LokoIkono({ iconUrl: 'bildoj/memorajxo.png' })
};

function ikononDeLoko(obj) {
	if (obj.tags['office'] == 'ngo' || obj.tags['office'] == 'association') {
		return ikonoj.ngo;
	}
	if (obj.tags['tourism'] == 'hotel' || obj.tags['tourism'] == 'hostel') {
		return ikonoj.hotelo;
	}
	if (obj.tags['books:language:eo'] == 'yes') {
		return ikonoj.libraro;
	}
	if (obj.tags['historic'] != null) {
		return ikonoj.memoraĵo;
	}
	if (obj.tags['name:etymology:wikidata'] == 'Q143') {
		return ikonoj.esperanto;
	}
	if (obj.tags['name:etymology:wikidata'] == 'Q11758') {
		return ikonoj.zamenhof;
	}
	if (obj.tags['language:eo'] == 'yes') {
		return ikonoj.esperantisto;
	}
	return ikonoj.alia;
}

function kreiPriskribon(obj) {
	var r = '';
	for (var s in obj.tags) {
		r += '<i>' + s + '</i>  =  <b>' + obj.tags[s] + '</b><br/>';
	}
	return r;
}

function eventoEnListo(e) {
	mapo.panTo(new L.LatLng($(this).data('loc-lat'), $(this).data('loc-lon')));
}

function aldoniEnListon(nomo, etikedoj, loc) {
	var btno = $('<a href="#" class="ui-btn ui-shadow ui-corner-all"' + 'data-loc-lat="' + loc[0] + '" data-loc-lon="' + loc[1] + '" data-filtertext="' + etikedoj + '">' + nomo + '</a>');
	var teksto = $('<li></li>');
	teksto.append(btno);
	$('#serĉlisto').append(teksto);
	btno.on('click', eventoEnListo);
}

var OPUrl = 'https://overpass-api.de/api/interpreter?data=';
function vojonOP(interpeto, vojo) {
	if (parametroj.rekte != null) {
		return OPUrl + interpeto;
	} else {
		return vojo;
	}
}

function manteloj(opt, lingvo) {
	var landojF = new L.OverpassFetcher({
		dosiero: vojonOP(escape(landoj(lingvo)), lingvo + '/landoj.json'),
		krei: function krei(objekto) {
			var nomo = objekto.tags['name:' + lingvo];
			var mia = L.divIcon({
				className: 'etikedo',
				html: "<span class='etikedo lando-etikedo'>" + nomo + "</span>"
			});
			aldoniEnListon(nomo, '', [objekto.lat, objekto.lon]);
			opt.landoj.addLayer(L.marker([objekto.lat, objekto.lon], { icon: mia }));
		}
	});

	var provincojF = new L.OverpassFetcher({
		dosiero: vojonOP(escape(provincoj(lingvo)), lingvo + '/provincoj.json'),
		krei: function krei(objekto) {
			var nomo = objekto.tags['name:' + lingvo];
			var mia = L.divIcon({
				className: 'etikedo',
				html: "<span class='etikedo provinco-etikedo'>" + nomo + "</span>"
			});
			aldoniEnListon(nomo, '', [objekto.lat, objekto.lon]);
			L.marker([objekto.lat, objekto.lon], { icon: mia }).addTo(opt.provincoj);
		}
	});

	var urbojF = new L.OverpassFetcher({
		dosiero: vojonOP(escape(urboj(lingvo)), lingvo + '/urboj.json'),
		krei: function krei(objekto) {
			var nomo = objekto.tags['name:' + lingvo];
			var mia = L.divIcon({
				className: 'etikedo',
				html: "<span class='etikedo urbo-etikedo'>" + nomo + "</span>"
			});
			aldoniEnListon(nomo, '', [objekto.lat, objekto.lon]);
			opt.urboj.addLayer(L.marker([objekto.lat, objekto.lon], { icon: mia }));
		}
	});

	var teroF = new L.OverpassFetcher({
		dosiero: vojonOP(escape(tero(lingvo)), lingvo + '/tero.json'),
		krei: function krei(objekto) {
			var nomo = objekto.tags['name:' + lingvo];
			var mia = L.divIcon({
				className: 'etikedo',
				html: "<span class='etikedo urbo-etikedo'>" + nomo + "</span>"
			});
			aldoniEnListon(nomo, '', [objekto.lat, objekto.lon]);
			opt.tero.addLayer(L.marker([objekto.lat, objekto.lon], { icon: mia }));
		}
	});

	var lokojF = new L.OverpassFetcher({
		dosiero: vojonOP(escape(lokoj(lingvo)), lingvo + '/lokoj.json'),
		krei: function krei(objekto) {
			L.marker([objekto.lat, objekto.lon], { icon: ikononDeLoko(objekto) }).addTo(opt.lokoj).bindPopup(kreiPriskribon(objekto));
		}
	});
}

$(document).bind('pageinit', function () {
	console.log(parametroj);
	if (parametroj.l != null) {
		console.log(parametroj.l);
		$('#landoj').val(parametroj.l).change();
	}
	if (parametroj.p != null) {
		$('#provincoj').val(parametroj.p).change();
	}
	if (parametroj.u != null) {
		$('#urboj').val(parametroj.u).change();
	}
	if (parametroj.t != null) {
		$('#tero').val(parametroj.t).change();
	}
	if (parametroj.lo != null) {
		$('#lokoj').val(parametroj.lo).change();
	}

	mapo = L.map('mapo').setView([parametroj.lat, parametroj.lng], parametroj.z);
	var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var teksto = traduki('Datumoj de la mapo {{link}} kontribuantoj', {
		'link': '<a href="http://openstreetmap.org">OpenStreetMap</a>',
		'interpolation': { 'escapeValue': false }
	});
	var osm = new L.TileLayer(osmUrl, { maxZoom: 19, opacity: 0.4, attribution: teksto });
	mapo.addLayer(osm);

	var landoj = L.LayerGroup.collision({ margin: 5 });
	var urboj = L.LayerGroup.collision({ margin: 5 });
	var provincoj = L.featureGroup(); //L.LayerGroup.collision({margin:5})
	var tero = L.featureGroup(); //L.LayerGroup.collision({margin:5})
	var lokoj = L.featureGroup(); //.addTo(mapo)

	manteloj({ landoj: landoj,
		provincoj: provincoj,
		urboj: urboj,
		tero: tero,
		lokoj: lokoj }, lingvo);

	mapo.on('moveend', function () {
		parametroj.lat = mapo.getCenter().lat;
		parametroj.lng = mapo.getCenter().lng;
		parametroj.z = mapo.getZoom();
		ŝanĝiParametrojn();
	});

	mapo.on('zoomend', function () {
		var elektoLandoj = $('#landoj').val();
		if ((mapo.getZoom() < 6 || elektoLandoj === 'C') && elektoLandoj !== 'N') {
			if (!mapo.hasLayer(landoj)) {
				mapo.addLayer(landoj);
			}
			console.log("Al: landoj");
		} else {
			console.log("For: landoj");
			if (mapo.hasLayer(landoj)) {
				mapo.removeLayer(landoj);
			}
		}

		var elektoProvincoj = $('#provincoj').val();
		if ((mapo.getZoom() > 4 || elektoProvincoj === 'C') && elektoProvincoj !== 'N') {
			if (!mapo.hasLayer(provincoj)) {
				mapo.addLayer(provincoj);
			}
			console.log("Al: provincoj");
		} else {
			console.log("For: provincoj");
			if (mapo.hasLayer(provincoj)) {
				mapo.removeLayer(provincoj);
			}
		}

		var elektoTero = $('#tero').val();
		if ((mapo.getZoom() > 4 || elektoTero === 'C') && elektoTero !== 'N') {
			if (!mapo.hasLayer(tero)) {
				mapo.addLayer(tero);
			}
			console.log("Al: tero");
		} else {
			console.log("For: tero");
			if (mapo.hasLayer(tero)) {
				mapo.removeLayer(tero);
			}
		}

		var elektoUrboj = $('#urboj').val();
		if ((mapo.getZoom() > 6 || elektoUrboj === 'C') && elektoUrboj !== 'N') {
			if (!mapo.hasLayer(urboj)) {
				mapo.addLayer(urboj);
			}
			console.log("Al: urboj");
		} else {
			console.log("For: urboj");
			if (mapo.hasLayer(urboj)) {
				mapo.removeLayer(urboj);
			}
		}

		var elektoLokoj = $('#lokoj').val();
		if ((mapo.getZoom() > 4 || elektoLokoj === 'C') && elektoLokoj !== 'N') {
			if (!mapo.hasLayer(lokoj)) {
				mapo.addLayer(lokoj);
			}
			console.log("Al: lokoj");
		} else {
			console.log("For: lokoj");
			if (mapo.hasLayer(lokoj)) {
				mapo.removeLayer(lokoj);
			}
		}

		console.log("Lokoj: " + mapo.hasLayer(lokoj));
		console.log("Urboj: " + mapo.hasLayer(urboj));
		console.log("Provincoj: " + mapo.hasLayer(provincoj));
		console.log("Landoj: " + mapo.hasLayer(landoj));
		console.log("Tero: " + mapo.hasLayer(tero));
		console.log(landoj);
		console.log(urboj);
	});

	$('#landoj, #provincoj, #urboj, #lokoj, #tero').on('change', function () {
		console.log("AA");
		parametroj.l = $('#landoj').val();
		parametroj.p = $('#provincoj').val();
		parametroj.u = $('#urboj').val();
		parametroj.t = $('#tero').val();
		parametroj.lo = $('#lokoj').val();
		mapo.fire('moveend');
		mapo.fire('zoomend');
	});

	mapo.fire('zoomend');

	setInterval(function () {
		$('#reklamujo')[0].contentWindow.location.reload(true);
	}, 60 * 1000);
});
//# sourceMappingURL=tuta.js.map
