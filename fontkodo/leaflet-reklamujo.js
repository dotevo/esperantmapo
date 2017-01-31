/**
 * @requires ./leaflet-ujo.js
 */
const reklamteksto = '<a class="reklamujo-fermbutono">X</a><br/>' +
	'<iframe data-aa="398901" src="https://ad.a-ads.com/398901?size=120x60"' +
	' scrolling="no" style="width:120px; height:60px; border:0px; padding:0;overflow:hidden"' +
	' allowtransparency="true" frameborder="0"></iframe><br/>' +
	'<a class="reklamujo-fermbutono">X</a>'

class Reklamujo {
	constructor(mapo) {
		this.mapo = mapo
		this.reklamo = new Ujo()
		this.reklamo.setPosition('bottomright')
		mapo.addControl(this.reklamo)
		this.reŝargi()
		this.intervalo = setInterval(this.reŝargi.bind(this), 1000 * 60 * 15)
	}

	reŝargi() {
		this.reklamo.setText(reklamteksto)
		$('.reklamujo-fermbutono').on('click', this.fermi.bind(this))
	}

	fermi() {
		clearInterval(this.intervalo);
		this.mapo.removeControl(this.reklamo)
	}
}
