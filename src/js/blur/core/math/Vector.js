BLUR.Vector = function(x,y,z) {
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
		var tempz = this.z;
		var tempx = this.x;

		this.x = ( tempx * Math.cos(angle * RADIANS) ) + ( tempz * Math.sin(angle * RADIANS) );
		this.z = ( tempx * -Math.sin(angle * RADIANS) ) + ( tempz * Math.cos(angle * RADIANS) );
	};

	this.rotateX = function ( angle ) {
		var tempY = this.y;
		var tempZ = this.z;

		this.y = ( tempY * Math.cos(angle * RADIANS) ) - ( tempZ * Math.sin(angle * RADIANS) );
		this.z = ( tempY * Math.sin(angle * RADIANS) ) + ( tempZ * Math.cos(angle * RADIANS) );
	};

	this.rotate = function( axis, amount ) {
		switch(axis) {
			case 'x':
				var tempY = this.y;
				var tempZ = this.z;

				this.y = ( tempY * Math.cos(amount * RADIANS) ) - ( tempZ * Math.sin(amount * RADIANS) );
				this.z = ( tempY * Math.sin(amount * RADIANS) ) + ( tempZ * Math.cos(amount * RADIANS) );
				break;
			case 'y':
				var tempz = this.z;
				var tempx = this.x;

				this.x = ( tempx * Math.cos(amount * RADIANS) ) + ( tempz * Math.sin(amount * RADIANS) );
				this.z = ( tempx * -Math.sin(amount * RADIANS) ) + ( tempz * Math.cos(amount * RADIANS) );
				break;
			case 'z':
				/*
				 * TODO: Write 'z' rotation functionality.
				 */
				break;
			default:
				alert('[BLUR.Vector] - Error: Please specify a valid axis for rotation, "' + axis + '" is not valid. ');
		}
	};

	this.round = function() {
		this.x = Math.round(x);
		this.y = Math.round(y);
		this.z = Math.round(z);
	};

	this.subtract = function(v) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
	};

	this.add = function(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
	};

	/*
	 * this.normalise - Makes the length = 1, by dividing x,y,z by the length.
	 */
	this.normalise = function() {
		tempX = this.x;
		tempY = this.y;
		tempX = this.z;

		dist = Math.sqrt( (this.x * this.x) + (this.y * this.y) + (this.z * this.z) );

		this.x = tempX * (1.0 / dist);
		this.y = tempY * (1.0 / dist);
		this.z = tempZ * (1.0 / dist);

		return this;
	};

	/*
	 * this.toString - Used to output all properties of the vector.
	 */
	this.toString = function() {
		return this.type + " [x: " + this.x + " , y: " + this.y + " z: " + this.z + "]";
	};

	this.type = 'BLUR.Vector';
};