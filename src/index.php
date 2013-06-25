<html>
<head>

<title>Sketchpad, A Canvas Experimient - harrynorthover.com</title>

<link rel="Shortcut Icon" href="favicon.ico">
<link type='text/css' href='css/style.css' rel="Stylesheet" />

<?php include('includes/javascript.php'); ?>

</head>
<body>

<!-- The controls dialogue -->
<div id="controls" title="Controls">
	Line Thickness: <div id="lineThickness" style="width:350px;"></div>
	<br>Line Opacity: <div id="lineAlpha" style="width:350px;"></div>
	<br>Line Colour: <div id="colorPicker"></div>
	<br><div id="clearAllButton">Clear Scene</div>
	<div id="invertButton">Invert</div>
</div>

<div id="canvasHolder">
	<!-- Get Canvas support fool! http://www.google.com/chrome -->
</div>

<div id='error' class='alert'>
	<p style=' font-family: "league-gothic-1","league-gothic-2",sans-serif; font-size:31px;'>Sorry, there has been some hind of server error. Try refreshing the page.</p>
	<p style='opacity:0.8; padding:10px;'>You can still use the drawing functionality, but the <b>interaction with other users will not be enabled</b>. Click anywhere to get rid of this box. <br><br>If the error still persists, let me know on <a href='http://www.twitter.com/harrynorthover' target='_blank'>twitter</a> or by <a href='mailto:me@harrynorthover.com'>email</a>.</p>
</div>

<!-- The chat box -->
<!--<div id="chat" title="Chat" style="display:none;">
	<div id="messages"></div>
	<div id="addMessage">
	    <input type="text" style="width:284px; height:30px; bottom:1px; opacity:0.8;" id="chatTextBox" class='textBox'>
	</div>
</div> -->

<!-- Console. -->
<div id='serverOutput'>
</div>

<div style='color: white; position: absolute; bottom: 102px; right: 180px; font-size: 10px; opacity: 0.3; display:none' id='serverHelp'>
	<p>To enable the console, type <b>enable</b>. To disable, type <b>disable</b> (type <b>help</b> for more)</p>
</div>

<input type="text" id="commandTxtBox"  class='textBox'/>
<!-- Console End. -->

<!-- The footer. -->
<div id="footer">
	<div id='about'>
	<a href='#comingsoon' target='_blank'><font style='opacity:0.7'>Designed &amp; Developed by </font>North Point Interactive</a>
	</div>
	<div id='key'>
	<img src="../assets/key.png" style='float:right; margin-right:5px;'></div>
	<!--<input type="text" id="nickname" value="Enter a nickname and press enter..." >-->
	<div id='currentUsers'> 0 </div>
	<div id='serverError'> Disconnected! </div>
</div>

<script type="text/javascript" src='js/init.js'></script>

<!-- Init all the JQuery UI components. -->
<script type="text/javascript">
$(function() { $( "#controls" ).dialog({ position:[20, 20], width:380, resizable: false, maxWidth:380, maxHeight:350, autoOpen:false }); });
$(function() { $( "#lineThickness" ).slider({ animate: true, min:0.1, max:3, value:lineThickness, step:0.1, change:function(e, ui) { app.onSliderChangeHandler(e); } }); });
$(function() { $( "#lineAlpha" ).slider({ animate: true, min:0.1, max:1, value:lineAlpha, step:0.1, change:function(e, ui) { app.onLineAlphaChange(e); } }); });
$(function() { $('#colorPicker').ColorPicker({ flat:true, onChange: function(hsb, hex, rgb, el) { app.onColourChangeHandler(rgb); } }); });

$(function() { $( "#clearAllButton" ).button(); });
$(function() { $( "#clearAllButton" ).click( function() { app.clear(); }) });
$(function() { $( "#invertButton" ).button(); });
$(function() { $( "#invertButton" ).click( function() { app.invert(); }) });

</script>

<!-- Google Analytics start. -->
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-8831987-6']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
<!-- Google Analytics end. -->

</body>
</html>