class OverpassVico {
	opcioj = {
		url: 'http://overpass-api.de/api/interpreter?data=',
		surŜarga: function() {
			console.log('Ŝarga')
		},
		surKompletigita: function() {
			console.log('Kompletigita')
		}
	}

	constructor(opcioj) {
		$.extend(this.opcioj, opcioj)
		this.overpassInformpetoj = []
		this.overpassHalto = true
	}

	komenciInformpeton() {
		this.overpassHalto = false
		var informpeto = this.overpassInformpetoj.pop()
		console.log(informpeto.url)
		var ĉi = this
		$.ajax({
			url: this.opcioj.url + informpeto.url,
			crossDomain: true,
			dataType: 'json',
			data: {}
		}).always(function(a, b) {
			if (ĉi.overpassInformpetoj.length > 0) {
				ĉi.komenciInformpeton()
			} else {
				ĉi.overpassHalto = true
				ĉi.opcioj.surKompletigita()
			}
			informpeto.revoko(a)
		})
	}

	elŝutiElOverpass(url, revoko) {
		this.overpassInformpetoj.push({'url': url, 'revoko': revoko})
		if (this.overpassInformpetoj.length == 1 && this.overpassHalto == true) {
			this.opcioj.surŜarga()
			this.komenciInformpeton()
		}
	}
}

let overpassVico = new OverpassVico({})

var url = '[out:json];node["name:eo"]["admin_level"="1"];out center;'
overpassVico.elŝutiElOverpass(escape(url), function(a, b) {
	console.log(a)
})
