BLUR.Text2D = function(t,pos) {
	this.text = t;

	var tempPos = pos;
	this.position = new BLUR.Vector(tempPos.x, tempPos.y, tempPos.z);
	this.material = new BLUR.BasicColorMaterial(new BLUR.Color(0,0,0),0.7);

	this.rotateY = function(angle) {
		var temp_p1 = new BLUR.Vector(this.position.x, this.position.y, this.position.z);
		temp_p1.rotateY(angle);
		this.position = temp_p1;
	};

	this.rotateX = function(angle) {
		var temp_p1 = new BLUR.Vector(this.position.x, this.position.y, this.position.z);
		temp_p1.rotateX(angle);
		this.position = temp_p1;
	};

	this.type = 'BLUR.Text2D';
};

BLUR.Text2D.prototype = new BLUR.Object3D();
BLUR.Text2D.prototype.constructor = BLUR.Text2D;