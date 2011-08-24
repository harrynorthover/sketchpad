/*
 * BLUR.Color - A basic color function.
 */

BLUR.Color = function( r,g,b ) {
	this.r = r;
	this.g = g;
	this.b = b;

	this.toHex = function() {
		var c = this.r + 256 * this.g + 65536 * this.b;
	    return c.toString(16);
	};

	this.toString = function() {
		return this.type + " [r: " + this.r + ", g: " + this.g + ", b: " + this.b + "]";
	};

	this.type = 'BLUR.Color';
};
