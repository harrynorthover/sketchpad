BLUR.Plane = function( p1, p2, p3, p4 ) {
	this.position = new BLUR.Vector(0,0,0);

	this.dimensions = [p1,p2,p3,p4];
	this.material = new BLUR.RGBColour( 255,255,255,1 );

	this.rotateY = function(angle) {
		var temp_p1 = new BLUR.Vector(this.dimensions[0].x, this.dimensions[0].y, this.dimensions[0].z);
		var temp_p2 = new BLUR.Vector(this.dimensions[1].x, this.dimensions[1].y, this.dimensions[1].z);
		var temp_p3 = new BLUR.Vector(this.dimensions[2].x, this.dimensions[2].y, this.dimensions[2].z);
		var temp_p4 = new BLUR.Vector(this.dimensions[3].x, this.dimensions[3].y, this.dimensions[3].z);

		temp_p1.rotateY(angle);
		temp_p2.rotateY(angle);
		temp_p3.rotateY(angle);
		temp_p4.rotateY(angle);

		this.dimensions[0] = temp_p1;
		this.dimensions[1] = temp_p2;
		this.dimensions[2] = temp_p3;
		this.dimensions[3] = temp_p4;
	};

	this.rotateX = function(angle) {
		/*
		 * TODO: Implement rotateX for Plane.
		 */
		var temp_p1 = new BLUR.Vector(this.dimensions[0].x, this.dimensions[0].y, this.dimensions[0].z);
		var temp_p2 = new BLUR.Vector(this.dimensions[1].x, this.dimensions[1].y, this.dimensions[1].z);
		var temp_p3 = new BLUR.Vector(this.dimensions[2].x, this.dimensions[2].y, this.dimensions[2].z);
		var temp_p4 = new BLUR.Vector(this.dimensions[3].x, this.dimensions[3].y, this.dimensions[3].z);

		temp_p1.rotateX(angle);
		temp_p2.rotateX(angle);
		temp_p3.rotateX(angle);
		temp_p4.rotateX(angle);

		this.dimensions[0] = temp_p1;
		this.dimensions[1] = temp_p2;
		this.dimensions[2] = temp_p3;
		this.dimensions[3] = temp_p4;
	};

	this.type = 'BLUR.Plane';
};