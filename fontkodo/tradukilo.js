i18next.use(i18nextXHRBackend);
i18next.init({
	debug: true,
	lng: 'eo',
	ns: ['traduko', 'leaflet'],
	defaultNS: 'traduko',
	fallbackLng: 'eo',
	saveMissing: true,
	backend: {
		loadPath: 'internaciigo/{{lng}}/{{ns}}.json'
	}
},
function() {
	jqueryI18next.init(i18next, $);
	$('body').localize();
})

function tradukiLeaflet() {
	$('#mapo [title]').each(function(index) {
		$(this).attr('title', i18next.t($(this).attr('title'), {ns: 'leaflet'}))
	})
}

i18next.on('languageChanged', function(lng) {
	tradukiLeaflet()
})
