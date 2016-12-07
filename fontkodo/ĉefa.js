let mapo;

/**
 * @requires ./tradukilo.js
 * @requires ./ui.js
 */

$(document).bind('pageinit', function() {
	mapo = L.map('mapo').setView([51.505, -0.09], 13)
	const osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
	const teksto = traduki('Datumoj de la mapo {{link}} kontribuantoj',
		{
			'link' : '<a href="http://openstreetmap.org">OpenStreetMap</a>',
			'interpolation': {'escapeValue': false}
		})
	const osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 19, attribution: teksto})
	mapo.addLayer(osm)

	mapo.whenReady(function() {
	})
})
