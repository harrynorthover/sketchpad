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

	this.toImage = function() {
		var img = _canvas.toDataURL('image/png');
		return img;
	};

	this.render = function( scene, camera ) {
		//_canvas.width 	= _WIDTH;
		//_canvas.height 	= _HEIGHT;

		// if autoclear is set to true, clear the screen before the next scene is rendered.
		if(_autoClear) this.clear();

		for(var i = 0; i < scene.objects.length; ++i)
		{
			var currentObj = scene.objects[i];
			switch(currentObj.type)
			{
			case 'BLUR.Text2D':
				this.drawText(currentObj);
				break;
			case 'BLUR.Particle':
				this.drawParticle(currentObj);
				break;
			case 'BLUR.Line3D':
				this.drawLine(currentObj);
				break;
			case 'BLUR.Plane':
				this.drawFace(currentObj);
				break;
			}
		}
	};

	this.drawTriangle = function( tri ) {

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
			_ctx.fillStyle 	= particle.material.toString();
			_ctx.fill();
		}
	};

	this.drawLine = function( line ) {
		points = [line.point1.convertTo2D( _fieldOfV ), line.point2.convertTo2D( _fieldOfV )];

		_ctx.lineWidth = line.thickness;
		_ctx.beginPath();
		_ctx.moveTo(points[0].x, points[0].y);
		_ctx.lineTo(points[1].x, points[1].y);
		_ctx.strokeStyle = line.material.toString();
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

	this.drawText = function(obj) {
		pos = obj.position.convertTo2D( _fieldOfV );
		if(obj.material != undefined) _ctx.fillStyle = obj.material.toString();
		else _ctx.fillStyle = "Black";
		_ctx.fillText(obj.text, pos.x, pos.y);
	};

	this.setDimensions = function ( width, height ) {
		_WIDTH 		= width;
		_HEIGHT 	= height;
	};

	this.clear = function() {
		_ctx.clearRect(-HALF_WIDTH,-HALF_HEIGHT, _WIDTH, _WIDTH);
	};

};