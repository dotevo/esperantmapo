$(document).bind('mobileinit', function() {
	$.mobile.ajaxEnabled = false
	$.mobile.hashListeningEnabled = false
	$.mobile.pushStateEnabled = false
});

$(document).on('pagecontainershow', function() {
	SkaliEnhavo()
	$(window).on('resize orientationchange', function() {
		SkaliEnhavo()
	})
})

function SkaliEnhavo() {
	scroll(0, 0);
	var content = $.mobile.getScreenHeight() - $('.ui-paĝokapo').outerHeight() -
		$('.ui-paĝopiedo').outerHeight() - $('.ui-enhavo').outerHeight() +
		$('.ui-enhavo').height()
	$('.ui-enhavo').height(content)
}

function preta() {
	var mapo = L.map('mapo').setView([51.505, -0.09], 13);
	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 19, attribution: osmAttrib});
	mapo.addLayer(osm);
}
