/**
 * @requires ./leaflet-ujo.js
 */
const reklamteksto = '<a class="reklamujo-fermbutono">X</a><br/><iframe scrolling="no" ' +
	'style="border: 0; width: 120px; height: 240px;" ' +
	'src="https://coinurl.com/get.php?id=59251&search=esperanto,language"></iframe><br/>' +
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
