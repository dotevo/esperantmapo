/**
 * @requires ./tradukilo.js
 */

$(document).bind('mobileinit', function() {
	$.mobile.ajaxEnabled = false
	$.mobile.hashListeningEnabled = false
	$.mobile.pushStateEnabled = false
})

$(document).on('pagecontainershow', function() {
	SkaliEnhavon()
	$(window).on('resize orientationchange', function() {
		SkaliEnhavon()
	})
	mapo.invalidateSize();
})

function SkaliEnhavon() {
	scroll(0, 0);
	var enhavo = $.mobile.getScreenHeight() - $('.ui-paĝokapo').outerHeight() -
		$('.ui-paĝopiedo').outerHeight() - $('.ui-enhavo').outerHeight() +
		$('.ui-enhavo').height()
	$('.ui-enhavo').height(enhavo)
}

$(document).on('i18nextPretas', function(evento, lingvoj) {
	var select = $('#lingvoj')
	for (const lingvo in lingvoj) {
		const opt = '<option class="lingvo" id="' + lingvo +
			'" value="' + lingvo + '">' + lingvoj[lingvo] + '</option>'
		select.append(opt)
	}
	console.log(tradukilo.akiriLingvon())
	var selected = select.find('#' + tradukilo.akiriLingvon())
	selected.attr('selected', 'selected')
	select.selectmenu();
	select.selectmenu('refresh', true);
	select.on('change', function () {
		var lingvo = this.value;
		tradukilo.ŝanĝiLingvon(lingvo)
	})
})
