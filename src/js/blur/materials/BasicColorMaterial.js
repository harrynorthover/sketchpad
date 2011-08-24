BLUR.BasicColorMaterial = function(c,a) {
	this.color = c;
	this.alpha = a;

	this.toString = function() {
		return "rgba(" + this.color.r + "," + this.color.g + "," + this.color.b + "," + this.alpha + ")";
	};

	this.type = 'BLUR.BasicColorMaterial';
};