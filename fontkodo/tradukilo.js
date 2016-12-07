i18next.use(i18nextXHRBackend)

function escapeHtml(objekto) {
	if (objekto.replace === undefined) {
		objekto = JSON.stringify(objekto)
	}
	return objekto
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')
}

function traduki(teksto, opcioj) {
	let datumoj = ''
	if (opcioj !== undefined) {
		datumoj = ' data-i18n-opcioj="' + escapeHtml(opcioj) + '"'
	}
	return '<span data-i18n="' + teksto + '" ' + datumoj + '>' + '</span>'
}

class Tradukilo {
	constructor() {
		let ĉi = this
		$.get('internaciigo/lingvoj.txt', function(datumoj) {
			let lingvoj = {}
			let linio = datumoj.split(/\n/)
			for (var n = 0 ; n < linio.length ; ++n) {
				if (linio[n].length > 0) {
					let x = linio[n].split(':')
					lingvoj[x[0]] = x[1]
				}
			}
			ĉi.lingvoj = lingvoj

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
			}, ĉi.i18nextPretas.bind(ĉi))
		})
	}

	akiriLingvon() {
		return i18next.language
	}

	i18nextPretas() {
		let ĉi = this
		this.tradukiLeaflet()
		this.tradukiPaĝon()
		i18next.on('languageChanged', function(lng) {
		})
		jqueryI18next.init(i18next, $)
		$(document).trigger('i18nextPretas', ĉi.lingvoj)
	}

	tradukiLeaflet() {
		$('#mapo [title]').each(function(index) {
			$(this).attr('title', i18next.t($(this).attr('aria-label'), {ns: 'leaflet'}))
		})
	}

	tradukiPaĝon() {
		$('[data-i18n]').each(function(index) {
			let teksto = $(this).attr('data-i18n-opcioj')

			let opcioj = ''
			if (teksto !== undefined) {
				opcioj = JSON.parse(teksto)
			}
			console.log(opcioj)
			$(this).html(i18next.t($(this).attr('data-i18n'), opcioj))
		})
	}

	ŝanĝiLingvon(lingvo) {
		const ĉi = this
		i18next.changeLanguage(lingvo, (err, t) => {
			ĉi.tradukiLeaflet()
			ĉi.tradukiPaĝon()
		})
	}
}

const tradukilo = new Tradukilo()
