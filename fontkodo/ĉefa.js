let mapo;

/**
 * @requires ./tradukilo.js
 * @requires ./ui.js
 * @requires ./leaflet-reklamujo.js
 * @requires ./overpass/overpass.js
 */

$(document).bind('pageinit', function() {
	mapo = L.map('mapo').setView([51.505, -0.09], 13)
	const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
	const teksto = traduki('Datumoj de la mapo {{link}} kontribuantoj',
		{
			'link' : '<a href="http://openstreetmap.org">OpenStreetMap</a>',
			'interpolation': {'escapeValue': false}
		})
	const osm = new L.TileLayer(osmUrl, {maxZoom: 19, opacity: 0.5, attribution: teksto})
	mapo.addLayer(osm)
	new Reklamujo(mapo)

	const landoj = L.featureGroup().addTo(mapo)
	const landojF = new L.OverpassFetcher({
		dosiero: 'landoj.json',
		krei: function(objekto) {
			var myIcon = L.divIcon({iconAnchor:[0,0], iconSize: [0,0], html: objekto.tags["name:eo"]})
			L.marker([objekto.lat, objekto.lon], {icon: myIcon}).addTo(landoj)
		}
	})

	const provincoj = L.featureGroup().addTo(mapo)
	const provincojF = new L.OverpassFetcher({
		dosiero: 'provincoj.json',
		krei: function(objekto) {
			var myIcon = L.divIcon({iconAnchor:[0,0], iconSize: [0,0], html: objekto.tags["name:eo"]})
			L.marker([objekto.lat, objekto.lon], {icon: myIcon}).addTo(provincoj)
		}
	})

	mapo.on('zoomend', function(){
		if(mapo.getZoom() < 6) {
			if(!mapo.hasLayer(landoj)) {
				mapo.addLayer(landoj)
			}
		} else {
			mapo.removeLayer(landoj);
		}

		if(mapo.getZoom() > 5) {
			if(!mapo.hasLayer(provincoj)) {
				mapo.addLayer(provincoj)
			}
		} else {
			mapo.removeLayer(provincoj);
		}
	})
})
