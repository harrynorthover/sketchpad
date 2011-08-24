BLUR.Vertex3 = function(x,y,z, radius) {
	RADIANS = Math.PI / 180;

	this.x = x;
	this.y = y;
	this.z = z;

	this.convertTo2D = function ( fov ) {
		var scale 	= _fieldOfV / ( _fieldOfV + this.z );

		var x 		= this.x * scale;
		var y 		= this.y * scale;

		return new BLUR.Point2D( x, y );
	};

	this.rotateY = function ( angle ) {
		cosRY = Math.cos(angle * RADIANS);
		sinRY = Math.sin(angle * RADIANS);

		var tempz = this.z;
		var tempx = this.x;

		this.x = ( tempx * cosRY ) + ( tempz * sinRY );
		this.z = ( tempx * -sinRY ) + ( tempz * cosRY );
	};

	this.rotateX = function ( angle ) {
		var tempY = this.y;
		var tempZ = this.z;

		this.y = ( tempY * Math.cos(angle * RADIANS) ) - ( tempZ * Math.sin(angle * RADIANS) );
		this.z = ( tempY * Math.sin(angle * RADIANS) ) + ( tempZ * Math.cos(angle * RADIANS) );
	};

	this.sub = function(v) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
	};

	this.add = function(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
	};

	this.normalize = function() {
		tempX = this.x;
		tempY = this.y;
		tempX = this.z;

		dist = Math.sqrt( (this.x * this.x) + (this.y * this.y) + (this.z * this.z) );

		this.x = tempX * (1.0 / dist);
		this.y = tempY * (1.0 / dist);
		this.z = tempZ * (1.0 / dist);

		return this;
	};

	this.type = 'BLUR.Vertex3';
};