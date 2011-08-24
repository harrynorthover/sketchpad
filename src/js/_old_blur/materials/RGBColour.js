BLUR.RGBColour = function(r,g,b,a) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;

	this.toString = function() {
		return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
	};

	this.type = 'BLUR.RGBColour';
};