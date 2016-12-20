'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ujo = L.Control.extend({ options: { position: 'bottomleft' },
	setText: function setText(html) {
		this.controlDiv.innerHTML = html;
	},
	onAdd: function onAdd(mapo) {
		this.controlDiv = L.DomUtil.create('div', 'leaflet-control-fenestro leaflet-control-mesaĝo');
		return this.controlDiv;
	}
});

/**
 * @requires ./leaflet-ujo.js
 */
var reklamteksto = '<a class="reklamujo-fermbutono">X</a><br/><iframe scrolling="no" ' + 'style="border: 0; width: 120px; height: 240px;" ' + 'src="http://coinurl.com/get.php?id=59251&search=esperanto,language"></iframe><br/>' + '<a class="reklamujo-fermbutono">X</a>';

var Reklamujo = function () {
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
				console.log(opcioj);
				$(this).html(i18next.t($(this).attr('data-i18n'), opcioj));
			});
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

var mapo = void 0;

/**
 * @requires ./tradukilo.js
 * @requires ./ui.js
 * @requires ./leaflet-reklamujo.js
 */

$(document).bind('pageinit', function () {
	mapo = L.map('mapo').setView([51.505, -0.09], 13);
	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var teksto = traduki('Datumoj de la mapo {{link}} kontribuantoj', {
		'link': '<a href="http://openstreetmap.org">OpenStreetMap</a>',
		'interpolation': { 'escapeValue': false }
	});
	var osm = new L.TileLayer(osmUrl, { maxZoom: 19, attribution: teksto });
	mapo.addLayer(osm);
	new Reklamujo(mapo);

	mapo.whenReady(function () {});
});
//# sourceMappingURL=tuta.js.map
