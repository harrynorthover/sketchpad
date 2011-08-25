BLUR.BasicColorMaterial = function(c,a) {
	this.color = c;
	this.alpha = a;

	this.toString = function() {
		return "BLUR.BasicColorMaterial( " + this.color.toString() + ", " + this.alpha + ")";
	};

	this.type = 'BLUR.BasicColorMaterial';
};