BLUR.Cube = function( w, h, d ) {
	this.depth = d;
	this.height = h;
	this.width = w;
	
	this.material = new BLUR.RGBColour( 255, 255, 255, 1 );
	
	var points 		= [];
	var shapes	 	= [];
	
	this.init = function() {
		points.push( new BLUR.Vertex3(-100, -100, -100, 1)  );
		points.push( new BLUR.Vertex3(100, -100, -100, 1)  );
		points.push( new BLUR.Vertex3(100, 100, -100, 1) );
		points.push( new BLUR.Vertex3(-100, 100, -100, 1)  );
		points.push( new BLUR.Vertex3(-100, -100, 100, 1)  );
		points.push( new BLUR.Vertex3(100, -100, 100, 1)  );
		points.push( new BLUR.Vertex3(100, 100, 100, 1) );
		points.push( new BLUR.Vertex3(-100, 100, 100, 1) );

		shapes.push( new BLUR.Plane( points[0], points[1], points[2], points[3]) );
		shapes.push( new BLUR.Plane( points[4], points[5], points[6], points[7]) );
		shapes.push( new BLUR.Plane( points[0], points[4], points[7], points[3]) );
		shapes.push( new BLUR.Plane( points[0], points[1], points[5], points[4]) );
		shapes.push( new BLUR.Plane( points[1], points[5], points[6], points[2]) );
		shapes.push( new BLUR.Plane( points[3], points[7], points[6], points[2]) );
	};
	
	init();
	
	this.type = 'BLUR.Cube';
};