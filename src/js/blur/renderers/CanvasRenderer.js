BLUR.CanvasRenderer = function ( scene, camera ) {
	_WIDTH			= (camera.fullBrowser == true) ? window.innerWidth : camera.width;
	_HEIGHT			= (camera.fullBrowser == true) ? window.innerHeight : camera.height;

	HALF_WIDTH 		= _WIDTH / 2;
	HALF_HEIGHT 	= _HEIGHT / 2;

	_fieldOfV		= camera.fov;

	_canvas 		= document.createElement( 'canvas' );
	_container		= document.getElementById( 'canvasHolder' );
	_container.appendChild(_canvas);

	_canvas.width 	= _WIDTH;
	_canvas.height 	= _HEIGHT;

	_ctx 			= _canvas.getContext('2d');

	_autoClear		= true;

	_ctx.translate(HALF_WIDTH, HALF_HEIGHT);


	this.render = function( scene, camera ) {
		// if autoclear is set to true, clear the screen before the next scene is rendered.
		if(_autoClear)
			this.clear();

		if(scene.visible) {
			for(var i = 0; i < scene.objects.length; ++i)
			{
				var currentObj = scene.objects[i];

				// render the object.
				this.renderObject(currentObj);

				// check for children and render any.
				if(currentObj.children.length > 0 && currentObj.visible)
					for( var j = 0; j < currentObj.children.length; ++j ) 
							this.renderObject(currentObj.children[j]);
			}
		}
	};

	this.renderObject = function( o ) {
		if(o.visible) {
			switch(o.type)
			{
				case 'BLUR.Particle':
					this.drawParticle(o);
					break;
				case 'BLUR.Line':
					this.drawLine(o);
					break;
				case 'BLUR.Plane':
					this.drawFace(o);
					break;
			}
		}
	};

	this.drawTriangle = function( tri ) {
		/*
		 * TODO: Finish drawTriangle.
		 */
	};

	this.drawParticle = function( particle ) {
		var TwoDpoint 	= particle.position.convertTo2D( _fieldOfV );

		var x 			= TwoDpoint.x;
		var y 			= TwoDpoint.y;

		if(particle.material.type == 'BLUR.ImageMaterial')
		{
			var img = new Image();
			img.src = particle.material.image;
			img.onload = function() {
				_ctx.drawImage(img, x, y, particle.radius, particle.radius);
				_ctx.beginPath();
				_ctx.arc( x, y, particle.radius, 0, Math.PI * 2, true );
				_ctx.closePath();
			};
		}
		else {
			_ctx.beginPath();
			_ctx.arc( x, y, particle.radius, 0, Math.PI * 2, true );
			_ctx.closePath();
			_ctx.fillStyle = "rgba(" + particle.material.color.r + "," + particle.material.color.g + "," + particle.material.color.b + "," + particle.material.alpha + ")"; //particle.material.toString();
			_ctx.fill();
		}
	};

	this.drawLine = function( line ) {
		points = [];
		points.push(line.position.convertTo2D( _fieldOfV ));
		points.push(line.to.convertTo2D( _fieldOfV ));

		_ctx.lineWidth = line.thickness;
		_ctx.beginPath();
		_ctx.moveTo(points[0].x, points[0].y);
		_ctx.lineTo(points[1].x, points[1].y);
		_ctx.strokeStyle = "rgba(" + line.material.color.r + "," + line.material.color.g + "," + line.material.color.b + "," + line.material.alpha + ")";
		_ctx.stroke();
	};

	this.drawFace = function ( face ) {
		var startPoint = face.dimensions[0].convertTo2D( _fieldOfV );

		/*
		 * TODO: Implement prespective drawing for BLUR.ImageMaterial.
		 */
		if(face.material.type == 'BLUR.ImageMaterial')
		{
			var img = new Image();
			img.src = face.material.image;
			img.onload = function() {
				_ctx.drawImage(img, startPoint.x, startPoint.y, 1000, 1000);
				_ctx.beginPath();
				_ctx.moveTo(startPoint.x, startPoint.y);

				for(var i = 1; i < face.dimensions.length; ++i)
				{
					var tmpPoint = face.dimensions[i].convertTo2D( _fieldOfV );
					_ctx.lineTo(tmpPoint.x, tmpPoint.y);
				}

				_ctx.closePath();
			};
		}
		else {
			_ctx.beginPath();
			_ctx.moveTo(startPoint.x, startPoint.y);

			for(var i = 1; i < face.dimensions.length; ++i)
			{
				var tmpPoint = face.dimensions[i].convertTo2D( _fieldOfV );
				_ctx.lineTo(tmpPoint.x, tmpPoint.y);
			}

			_ctx.closePath();
			_ctx.fillStyle = face.material.toString();
			_ctx.fill();
		}
	};

	this.setDimensions = function ( width, height ) {
		_WIDTH 		= width;
		_HEIGHT 	= height;
	};

	this.clear = function() {
		_ctx.clearRect(-HALF_WIDTH,-HALF_HEIGHT, _WIDTH, _WIDTH);
	};

};