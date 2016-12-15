var Ujo =  L.Control.extend({options: {position: 'bottomleft'},
	setText: function(html) {
		this.controlDiv.innerHTML = html
	},
	onAdd: function (mapo) {
		this.controlDiv = L.DomUtil.create('div', 'leaflet-control-fenestro leaflet-control-mesaĝo')
		return this.controlDiv
	}
})
