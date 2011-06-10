BLUR.Particle = function(pos, radius) {
	var tempPos = pos;

	this.position 	= new BLUR.Vertex3(tempPos.x, tempPos.y, tempPos.z);
	this.radius 	= radius;

	this.material 	= new BLUR.RGBColour(255, 255, 255, 1);

	this.rotateY = function(angle) {
		var temp_p1 = new BLUR.Vertex3(this.position.x, this.position.y, this.position.z);
		temp_p1.rotateY(angle);
		this.position = temp_p1;
	};

	this.rotateX = function(angle) {
		var temp_p1 = new BLUR.Vertex3(this.position.x, this.position.y, this.position.z);
		temp_p1.rotateX(angle);
		this.position = temp_p1;
	};

	this.type = 'BLUR.Particle';
};