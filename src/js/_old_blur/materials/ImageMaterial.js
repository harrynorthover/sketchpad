BLUR.ImageMaterial = function (imgSrc) {
	this.image = imgSrc;

	this.toString = function() {
		return "BLUR.ImageMaterial( imageSource: '" + this.image + "' )";
	};

	this.type = 'BLUR.ImageMaterial';
};