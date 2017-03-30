L.LatLngBounds.prototype.limigaKesto = function () {
	var a = this._southWest,
		b = this._northEast
	return [Math.round(a.lat * 1000) / 1000 + 0.0001,
		Math.round(a.lng * 1000) / 1000 + 0.0001,
		Math.round(b.lat * 1000) / 1000 - 0.0001,
		Math.round(b.lng * 1000) / 1000 - 0.0001].join(',')
};

/**
 * @requires ./vico.js
 */

L.OverpassFetcher = L.LayerGroup.extend({
	options: {
		dosiero: 'datumo.json',
		krei: function() {}
	},
	initialize: function (options) {
		L.Util.setOptions(this, options)
		let ĉi = this
		this._nodes = {}

		console.log(this.options.dosiero)
		$.ajax({
			url: this.options.dosiero,
			crossDomain: true,
			dataType: 'json'
		}).always(function(a, b) {
			ĉi.analizi(a)
		})
	},
	analizi: function(data) {
		if (data.responseJSON.elements != undefined) {
			data = data.responseJSON
		}
		if (data.elements === undefined) {
			console.log(data)
			return
		}

		for (var key in data.elements) {
			let el = data.elements[key]
			if (el.center != null) {
				el.lat = el.center.lat
				el.lon = el.center.lon
			}
			this.options.krei(el)
		}
	}
})

L.overpassFetcher = function (layers) {
	return new L.OverpassFetcher(layers)
}
