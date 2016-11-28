$(document).bind('mobileinit', function() {
	$.mobile.ajaxEnabled = false
	$.mobile.hashListeningEnabled = false
	$.mobile.pushStateEnabled = false
});

$(document).on('pagecontainershow', function() {
	SkaliEnhavon()
	$(window).on('resize orientationchange', function() {
		SkaliEnhavon()
	})
})

function SkaliEnhavon() {
	scroll(0, 0);
	var enhavo = $.mobile.getScreenHeight() - $('.ui-paĝokapo').outerHeight() -
		$('.ui-paĝopiedo').outerHeight() - $('.ui-enhavo').outerHeight() +
		$('.ui-enhavo').height()
	$('.ui-enhavo').height(enhavo)
}

function preta() {
	var mapo = L.map('mapo').setView([51.505, -0.09], 13);
	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var teksto = 'Datumoj de la mapo ©' +
		'<a href="http://openstreetmap.org">OpenStreetMap</a> kontribuantojn';
	var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 19, attribution: teksto});
	mapo.addLayer(osm);
}
