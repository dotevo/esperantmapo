'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ujo = L.Control.extend({ options: { position: 'bottomleft' },
	setText: function (html) {
		this.controlDiv.innerHTML = html;
	},
	onAdd: function (mapo) {
		this.controlDiv = L.DomUtil.create('div', 'leaflet-control-fenestro leaflet-control-mesaĝo');
		return this.controlDiv;
	}
});

/**
 * @requires ./leaflet-ujo.js
 */
const reklamteksto = '<a class="reklamujo-fermbutono">X</a><br/><iframe scrolling="no" ' + 'style="border: 0; width: 120px; height: 240px;" ' + 'src="https://coinurl.com/get.php?id=59251&search=esperanto,language"></iframe><br/>' + '<a class="reklamujo-fermbutono">X</a>';

let Reklamujo = function () {
	function Reklamujo(mapo) {
		_classCallCheck(this, Reklamujo);

		this.mapo = mapo;
		this.reklamo = new Ujo();
		this.reklamo.setPosition('bottomright');
		mapo.addControl(this.reklamo);
		this.reŝargi();
		this.intervalo = setInterval(this.reŝargi.bind(this), 1000 * 60 * 15);
	}

	_createClass(Reklamujo, [{
		key: 're\u015Dargi',
		value: function reArgi() {
			this.reklamo.setText(reklamteksto);
			$('.reklamujo-fermbutono').on('click', this.fermi.bind(this));
		}
	}, {
		key: 'fermi',
		value: function fermi() {
			clearInterval(this.intervalo);
			this.mapo.removeControl(this.reklamo);
		}
	}]);

	return Reklamujo;
}();

i18next.use(i18nextXHRBackend);

function escapeHtml(objekto) {
	if (objekto.replace === undefined) {
		objekto = JSON.stringify(objekto);
	}
	return objekto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function traduki(teksto, opcioj) {
	let datumoj = '';
	if (opcioj !== undefined) {
		datumoj = ' data-i18n-opcioj="' + escapeHtml(opcioj) + '"';
	}
	return '<span data-i18n="' + teksto + '" ' + datumoj + '>' + '</span>';
}

let Tradukilo = function () {
	function Tradukilo() {
		_classCallCheck(this, Tradukilo);

		let ĉi = this;
		$.get('internaciigo/lingvoj.txt', function (datumoj) {
			let lingvoj = {};
			let linio = datumoj.split(/\n/);
			for (var n = 0; n < linio.length; ++n) {
				if (linio[n].length > 0) {
					let x = linio[n].split(':');
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
			let ĉi = this;
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
				let teksto = $(this).attr('data-i18n-opcioj');

				let opcioj = '';
				if (teksto !== undefined) {
					opcioj = JSON.parse(teksto);
				}
				console.log(opcioj);
				$(this).html(i18next.t($(this).attr('data-i18n'), opcioj));
			});
		}
	}, {
		key: '\u015Dan\u011DiLingvon',
		value: function anILingvon(lingvo) {
			const ĉi = this;
			i18next.changeLanguage(lingvo, (err, t) => {
				ĉi.tradukiLeaflet();
				ĉi.tradukiPaĝon();
			});
		}
	}]);

	return Tradukilo;
}();

const tradukilo = new Tradukilo();

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
	for (const lingvo in lingvoj) {
		const opt = '<option class="lingvo" id="' + lingvo + '" value="' + lingvo + '">' + lingvoj[lingvo] + '</option>';
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

let OverpassVico = function () {
	function OverpassVico(opcioj) {
		_classCallCheck(this, OverpassVico);

		this.opcioj = {
			url: 'http://overpass-api.de/api/interpreter?data=',
			surŜarga: function () {
				console.log('Ŝarga');
			},
			surKompletigita: function () {
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

L.OverpassFetcher = L.LayerGroup.extend({
	options: {
		dosiero: "datumo.json",
		krei: function () {}
	},
	initialize: function (options) {
		L.Util.setOptions(this, options);
		let ĉi = this;
		this._nodes = {};

		console.log(this.options.dosiero);
		$.ajax({
			url: this.options.dosiero,
			crossDomain: true,
			dataType: 'json'
		}).always(function (a, b) {
			ĉi.analizi(a.responseJSON);
		});
	},
	analizi: function (data) {
		console.log("analizi");
		if (data.elements === undefined) {
			console.log(data);return;
		}

		for (var key in data.elements) {
			let el = data.elements[key];
			this.options.krei(el);
		}
	}
});

L.overpassFetcher = function (layers) {
	return new L.OverpassFetcher(layers);
};

let mapo;

/**
 * @requires ./tradukilo.js
 * @requires ./ui.js
 * @requires ./leaflet-reklamujo.js
 * @requires ./overpass/overpass.js
 */

$(document).bind('pageinit', function () {
	mapo = L.map('mapo').setView([51.505, -0.09], 13);
	const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	const teksto = traduki('Datumoj de la mapo {{link}} kontribuantoj', {
		'link': '<a href="http://openstreetmap.org">OpenStreetMap</a>',
		'interpolation': { 'escapeValue': false }
	});
	const osm = new L.TileLayer(osmUrl, { maxZoom: 19, opacity: 0.5, attribution: teksto });
	mapo.addLayer(osm);
	new Reklamujo(mapo);

	const landoj = L.featureGroup().addTo(mapo);
	const landojF = new L.OverpassFetcher({
		dosiero: 'landoj.json',
		krei: function (objekto) {
			var myIcon = L.divIcon({ iconAnchor: [0, 0], iconSize: [0, 0], html: objekto.tags["name:eo"] });
			L.marker([objekto.lat, objekto.lon], { icon: myIcon }).addTo(landoj);
		}
	});

	const provincoj = L.featureGroup().addTo(mapo);
	const provincojF = new L.OverpassFetcher({
		dosiero: 'provincoj.json',
		krei: function (objekto) {
			var myIcon = L.divIcon({ iconAnchor: [0, 0], iconSize: [0, 0], html: objekto.tags["name:eo"] });
			L.marker([objekto.lat, objekto.lon], { icon: myIcon }).addTo(provincoj);
		}
	});

	mapo.whenReady(function () {
		//
	});

	mapo.on('zoomend', function () {
		if (mapo.getZoom() < 6) {
			if (!mapo.hasLayer(landoj)) {
				mapo.addLayer(landoj);
			}
		} else {
			mapo.removeLayer(landoj);
		}

		if (mapo.getZoom() > 5) {
			if (!mapo.hasLayer(provincoj)) {
				mapo.addLayer(provincoj);
			}
		} else {
			mapo.removeLayer(provincoj);
		}
	});
});
//# sourceMappingURL=tuta.js.map
