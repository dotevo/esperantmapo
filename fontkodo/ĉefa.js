let mapo;

/**
 * @requires ./tradukilo.js
 * @requires ./ui.js
 * @requires ./leaflet-reklamujo.js
 */

$(document).bind('pageinit', function() {
	mapo = L.map('mapo').setView([51.505, -0.09], 13)
	const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
	const teksto = traduki('Datumoj de la mapo {{link}} kontribuantoj',
		{
			'link' : '<a href="http://openstreetmap.org">OpenStreetMap</a>',
			'interpolation': {'escapeValue': false}
		})
	const osm = new L.TileLayer(osmUrl, {maxZoom: 19, attribution: teksto})
	mapo.addLayer(osm)
	new Reklamujo(mapo)

	mapo.whenReady(function() {
	})
})
