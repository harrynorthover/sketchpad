<script type="text/javascript" src='js/sketchpad.js'></script>

<!-- jQuery styles and shit... -->
<link rel="stylesheet" media="screen" type="text/css" href="js/ui/colorpicker/css/colorpicker.css" />
<link type="text/css" href="js/ui/css/custom-theme/jquery-ui-1.8.6.custom.css" rel="Stylesheet" />

<script type="text/javascript" src="js/ui/js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="js/ui/js/jquery-ui-1.8.6.custom.min.js"></script>

<script type="text/javascript" src="http://use.typekit.com/bli4eqe.js"></script>
<script type="text/javascript">try{Typekit.load();}catch(e){}</script>

<!-- JS for the colour picker component. -->
<script type="text/javascript" src="js/ui/colorpicker/js/colorpicker.js"></script>

<!-- Include all the necessary BLUR 3D Engine files. -->
<script type="text/javascript" src="js/blur/Blur.js"></script>
<script type="text/javascript" src="js/blur/core/display/Color.js"></script>
<script type="text/javascript" src="js/blur/materials/BasicColorMaterial.js"></script>
<script type="text/javascript" src="js/blur/core/math/Vector.js"></script>
<script type="text/javascript" src="js/blur/core/math/Matrix4.js"></script>
<script type="text/javascript" src="js/blur/core/display/Point2D.js"></script>
<script type="text/javascript" src="js/blur/core/display/Object3D.js"></script>
<script type="text/javascript" src="js/blur/objects/primitives/Line.js"></script>
<script type="text/javascript" src="js/blur/objects/primitives/Particle.js"></script>
<script type="text/javascript" src="js/blur/objects/primitives/Text2D.js"></script>
<script type="text/javascript" src="js/blur/camera/Camera3D.js"></script>
<script type="text/javascript" src="js/blur/scenes/Scene3D.js"></script>
<script type="text/javascript" src="js/blur/renderers/CanvasRenderer.js"></script>

<script type="text/javascript" src="js/external/modernizr-1.6.min.js"></script>

<!-- Include the WebSocket shit. -->
<script type="text/javascript" src="js/network.js"></script>
<!-- Include all the console functionality. -->
<script type="text/javascript" src="js/console.js"></script>
<!-- Include all the drawing functionality. -->
<script type="text/javascript" src="js/connected.js"></script>

<script type="text/javascript">
jQuery(document).ready(function() {
	app.allowKeyboardEvents = true;
	
	$('#hint, #error').click(function() {
		$('#hint').fadeOut('slow');
	});

	$('#nickname').focus(function(e) {
		if($('#nickname').val() == 'Enter a nickname and press enter...') $('#nickname').val("");
		app.allowKeyboardEvents = false;
	});
	
	$('#nickname, #commandTxtBox, #chatTextBox').focusout(function(e) {
		app.allowKeyboardEvents = true;
	});
	
	$('#nickname').keypress(function(e) {
		if(e.charCode == 13) 
			app.updateNickname($('#nickname').val());
	});

	$('#commandTxtBox, #chatTextBox').focus(function(e) {
		app.allowKeyboardEvents = false;
	});
	
	$('#commandTxtBox').keypress(function(e) {
		if(e.charCode == 13) {
			app.sendCommand($('#commandTxtBox').val());
			$('#commandTxtBox').val('');
		}
	});

	$('#chatTextBox').keypress(function(e) {
		if(e.charCode == 13) {
			app.sendMessage(escape($('#chatTextBox').val()));
			$('#chatTextBox').val("");
		}
	});
	
	jQuery(document).keypress(function(e) {
		console.log('keypress - app.allowKeyboardEvents:' + app.allowKeyboardEvents);
		if(app.allowKeyboardEvents) 
			app.onKeyPressHandler(e);
	});
	
	$('#canvasHolder').mousemove(function(e) {
		app.setMousePosition(e.pageX, e.pageY);
	});
	
	$('#canvasHolder').mousedown(function(e) {
		app.onMouseDownHandler(e);
	});
	
	$('#canvasHolder').mouseup(function(e)   {
		app.onMouseUpHandler(e);
	});
	
	/*$('#about').hover(function(e) {
		$(this).animate({opacity:1}, 'slow');
	}, function(e) {
		$(this).animate({opacity:0.5}, 'fast');
	});*/
});
</script>