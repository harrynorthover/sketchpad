BLUR.Text2D = function(t,pos) {
	this.text = t;

	var tempPos = pos;
	this.position = new BLUR.Vertex3(tempPos.x, tempPos.y, tempPos.z);
	this.material = new BLUR.RGBColour(0,0,0,0.7);

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

	this.type = 'BLUR.Text2D';
};