/**
 * Initalises the sketchpad. 
 */

if (Modernizr.canvas && Modernizr.websockets) {
	app = new SKETCHPAD.App();
	app.init();
}
else {
	document.getElementById('error').innerHTML = '<p id="requirements">Sorry, this demo requires WebSockets and Canvas support.</p><p>Try <a href="http://www.google.com/chrome" target="_blank">Google Chrome</a> perhaps?</p>';
	$('#error').fadeIn();
	$('#footer').fadeOut();
}
	