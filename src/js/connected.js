/**
 * The main application code.
 */

SKETCHPAD.App = function() {
	widthOffset					= 0;
	heightOffset				= 0;
	
	camera 						= new BLUR.Camera3D( window.innerWidth - widthOffset, window.innerHeight - heightOffset );
	scene 						= new BLUR.Scene3D();
	renderer 					= null;

	mouseX 						= 0;
	mouseY 						= 0;

	nicknameObj					= null;
	localCursor					= null;

	drawingEnabled				= false;
	rotationEnabled 			= false;
	debug 						= false;
	shouldDrawFromStart 		= true;

	allowKeyboardEvents 		= true;

	// lines drawn by the local user.
	localLines					= [];
	// see network.js for array of network lines.

	// line drawing
	lineThickness				= 0.9;
	lineAlpha					= 0.8;
	lineMaterial				= [245,245,245];
								
	//Last 2 not implemented yet. 
	tools						= ['line', 'block', 'eraser'];
	currentTool					= tools[0];

	// network stuff
	net							= null;
	consoleEnabled				= false;
	terminal					= null;
	chatShowing					= false;

	this.init = function() {
		renderer 				= new BLUR.CanvasRenderer( scene, camera );
		terminal 				= new SKETCHPAD.Terminal();
		net 					= new SKETCHPAD.Network(this, scene, terminal);
		
		net.init();
		terminal.setNetworkInterface(net);

		localCursor 			= new BLUR.Particle( new BLUR.Vertex3( mouseX, mouseY, 1 ), 4 );
		localCursor.material 	= new BLUR.RGBColour(24,116,205, 0.3);

		nicknameObj 			= new BLUR.Text2D( "", new BLUR.Vertex3( localCursor.position.x + 10, localCursor.position.y, localCursor.position.z) );
		nicknameObj.material 	= new BLUR.RGBColour(245,245,245,0.7);
		// nicknameObj.text		= net.id ? net.id : '';

		scene.addObject(localCursor);
		scene.addObject(nicknameObj);

		setInterval( function ( that ) {
			that.render();
		}, 1000 / 60, this );
	};

	this.render = function() {
		if(rotationEnabled) this.rotate('mouseCoords');

		/*
		 * For some reason I still have to rotate by a value for the network lines to be draw correctly
		 * when 3d rotation is turned off.
	     */
		else this.rotate(0.00000000000000000000000000000000000000001 / (2000 * 1000));

		if(drawingEnabled) {
			switch (currentTool) {
			case 'line':
				this.drawLine(mouseX, mouseY, -1);
				break;
			case 'block':
				//TODO: this.drawBlock(mouseX, mouseY, 1);
			}
		}

		renderer.render( scene, camera );
	};

	this.rotate = function( amount ) {
		for(var i = 0; i < scene.objects.length; ++i)
		{
			var o = scene.objects[i];
			if(o.type != 'BLUR.Particle' && o.type != 'BLUR.Text2D' && o.type != 'BLUR.MouseCursor') {
				if(amount == 'mouseCoords') {
					o.rotateY(((window.innerWidth / 2) - mouseX) * .004);
					o.rotateX(((window.innerHeight / 2) - mouseY) * .004);
				} else {
					o.rotateY(amount);
					o.rotateX(amount);
				}
			}
		}
	};

	this.randomNumber = function(min, max) {
		return ( (Math.random() * (max - min) ) + min);
	};

	this.drawLine = function(x, y, z)
	{
		/* Gets the initial mouse point to draw the line from. If a previous line
		 * has been draw (eg, the mouse button has not been lifted) then the position 
		 * used is just the last object to be added to the scene.
		 */
		var p1 					= (shouldDrawFromStart) ? new BLUR.Vertex3(mouseX - (window.innerWidth/2), 
																		   mouseY - (window.innerHeight/2 - heightOffset/2), z) : localLines[localLines.length - 1].point2;
		
		var line 				= new BLUR.Line3D( p1, new BLUR.Vertex3( x - (window.innerWidth/2), 
																		 y - (window.innerHeight/2 - heightOffset/2), 
																		 z), lineThickness );
		
		/*var d1					= line.point1.x - line.point1.x;
		var d2					= line.point1.y - line.point2.y;
		var alpha 				= Math.round(Math.sqrt((d1*d1) + (d2*d2)));*/
				
		line.material			= new BLUR.RGBColour( lineMaterial[0], 
													  lineMaterial[1], 
													  lineMaterial[2], 
													  /*alpha*/ lineAlpha );

		scene.addObject(line);
		localLines.push(line);

		// send new line to others.
		net.addLine(line);

		shouldDrawFromStart 	= false;
	};

	this.invert = function() {
		for(var i = 0; i < scene.objects.length; ++i)
		{
			if(scene.objects[i].type == "BLUR.Line3D")
			{
				scene.objects[i].point1 = new BLUR.Vertex3( scene.objects[i].point1.y, scene.objects[i].point1.x, scene.objects[i].point1.z );
				scene.objects[i].point2 = new BLUR.Vertex3( scene.objects[i].point2.y, scene.objects[i].point2.x, scene.objects[i].point2.z );
			}
		}
	};

	this.clear = function() {
		/*
		 * TODO: Fix this function so that all the scene is cleared with one
		 * loop instead of looping through this.
		 */
		for(var j = 0; j <= 15; ++j) {
			for(var i = 0; i < scene.objects.length; ++i) {
				if(scene.objects[i].type == 'BLUR.Line3D')
					scene.removeObject(scene.objects[i]);
			}
		}
	};

	this.setMousePosition = function( x, y )
	{
		mouseX 					= Math.round(x);
		mouseY 					= Math.round(y);

		localCursor.position 	= new BLUR.Vertex3(Math.round(mouseX - (window.innerWidth/2)), 
												   Math.round(mouseY - (window.innerHeight/2 - heightOffset/2)), 
												   1);
		nicknameObj.position 	= new BLUR.Vertex3(localCursor.position.x + 10, 
											       localCursor.position.y, 
											       localCursor.position.z);

		net.updateCursorPosition(localCursor.position.x, 
								 localCursor.position.y);
	};


	// takes the url passed into the browser and gets x,y coords that need to be drawn
	// and adds them to the scene.
	/*this.parseURL = function()
	{
		if(window.location.hash != "")
		{
			var params = window.location.hash.split('_');
			params[0] = params[0].split('#')[1];

	 		for(var i = 0; i < params.length; ++i)
			{
				var c = params[i].split('x');
				var line = new BLUR.Line3D( new BLUR.Vertex3(c[0], c[1], c[2]), new BLUR.Vertex3( c[3], c[4], c[5]), c[7] );

				var v = c[6].split('(');
				var mat = v[1].split(',');
				mat[3] = mat[3].slice(0, mat[3].length-1);

				line.material = new BLUR.RGBColour( mat[0], mat[1], mat[2], mat[3] );

				scene.addObject(line);
				localLines.push(line);
			}
		}
	}; */

	this.updateNickname = function(name) {
		nicknameObj.text = $('#nickname').val();
		net.updateNickname(name);
	};

	this.sendMessage = function(message) {
		net.sendMessage(message);
	};
	
	this.sendCommand = function(message) {
		terminal.sendCommand(message);
	};

	/*
	 * EVENT HANDLERS
	 * ---------------------------------------------------------------------------
	 */

	this.onMouseDownHandler = function(e) {
		$('#hint').fadeOut();
		$('#error').fadeOut();
		$('#footer').animate({opacity:1}, 'fast');

		shouldDrawFromStart = true;
		drawingEnabled = true;
		this.setMousePosition(e.pageX, e.pageY);

		/* This function is designed to tell the server that the user has just clicked
		 * down on the Canvas and needs to draw from the current mouse position, not
		 * the last line draw.
		 */
		net.initNewLine();
	};

	this.onMouseUpHandler = function(e) {
		drawingEnabled = false;
	};

	this.onKeyPressHandler = function(e) {
		e.preventDefault();

		switch(e.charCode) {
			case 100:
				debug = (debug) ? false : true;
				break;
			case 102:
				rotationEnabled = (rotationEnabled) ? false : true;
				if(debug) 
					alert('Allow Mouse Rotation: ' + rotationEnabled);
				break;
			case 32:
				rotationEnabled = (rotationEnabled) ? false : true;
				if(debug) 
					alert('Allow Mouse Rotation: ' + rotationEnabled);
				break;
			case 99:
				this.clear();
				break;
			case 105:
				this.invert();
				break;
			case 120:
				if($("#controls").dialog("isOpen")) $("#controls").dialog("close");
				else $("#controls").dialog("open");
				break;
			case 121:
				this.chat();
				break;
			case 109:
				drawingEnabled = false;
				break;
			case 111:
				terminal.display();
				break;
		}

		if(debug)
			alert(e.charCode);
	};

	this.onSliderChangeHandler = function(e) {
		lineThickness = $( "#lineThickness" ).slider("value");
	};

	this.onFadeTimeChangeHandler = function(e) {
		fadeAmount = ($( "#fadeTime" ).slider("value") * .2);
	};

	this.onColourChangeHandler = function(rgb) {
		lineMaterial[0] = rgb.r;
		lineMaterial[1] = rgb.g;
		lineMaterial[2] = rgb.b;
	};

	this.onLineAlphaChange = function(e) {
		lineAlpha = $( "#lineAlpha" ).slider("value");
	};

	this.chat = function(s) {
		if(chatShowing && s != 'show') {
			$('#chat,#chatTextBox').fadeOut('fast');
			chatShowing = false;
		}
		else {
			$('#chatTextBox').focus();
			$('#chat,#chatTextBox').fadeIn('fast');
			chatShowing = true;
		}
	};

	this.addMessage = function(text) {
		document.getElementById('messages').innerHTML += '' + unescape(text) + '<br>';
		document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
		this.chat('show');
	};

	this.updateUserAmount = function(amount) {
		document.getElementById('currentUsers').innerHTML = '<b>' + amount + '</b>';
	};

	this.showError = function() {
		$('#hint').fadeOut();
		$('#error').fadeIn('slow');
		$('#serverError').fadeIn('fast');
		$('#footer').animate({opacity:0.2}, 'fast');
		this.updateUserAmount(0);
		net.removeAllUsers();
	};

	this.hideError = function() {
		$('#error').fadeOut('fast');
		$('#serverError').fadeOut('fast');
		$('#footer').animate({opacity:1}, 'fast');
	};

	this.addServerMessage = function(text) {
		document.getElementById('messages').innerHTML += '<font style="opacity:0.5">' + text + '</font><br>';
		document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
		this.chat('show');
	};

	this.addServerError = function(text) {
		document.getElementById('messages').innerHTML += '<br><font style="color:red">Server: ' + text + '</font><br>';
		document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
		this.chat('show');
	};
};