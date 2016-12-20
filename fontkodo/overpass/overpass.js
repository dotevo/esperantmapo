L.LatLngBounds.prototype.limigaKesto = function () {
	var a = this._southWest,
		b = this._northEast;
	return [Math.round(a.lat * 1000) / 1000 + 0.0001,
		Math.round(a.lng * 1000) / 1000 + 0.0001,
		Math.round(b.lat * 1000) / 1000 - 0.0001,
		Math.round(b.lng * 1000) / 1000 - 0.0001].join(',');
};

/**
 * @requires ./vico.js
 */
