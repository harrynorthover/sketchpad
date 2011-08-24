BLUR.Object3D = function() {
	this.parent = undefined;
	this.children = [];

	this.position = new BLUR.Vector(0,0,0);
	this.color = new BLUR.Color( 0, 0, 0 );
	this.material = new BLUR.BasicColorMaterial( this.color, 1 );

	this.visible = true;
	this.rotation = 0;
	this.scale = new BLUR.Vector(0,0,0);

	this.matrix = new BLUR.Matrix4();

	this.rotateX = function( a ) {
		if(this.type == 'BLUR.Particle')
			console.log( a );

		this.position.rotateX( a );

		for(var i = 0; i < this.children.length; ++i )
			this.children[i].rotateX( a );
	};

	this.rotateY = function( a ) {
		this.position.rotateY( a );

		for(var i = 0; i < this.children.length; ++i )
			this.children[i].rotateY( a );
	};

	this.rotateZ = function( a ) {
		/*
		 * TODO: Finish this function, rotateZ needs to be implemented
		 * in Vector.js.
		 */
	};

	this.translate = function( axis, amount ) {
		switch (axis) {
		case 'x':
			this.position.x += amount;
			for( var i = 0; i < this.children.length; ++i) {
				this.children[i].position.x += amount;
			}
			break;

		case 'y':
			this.position.y += amount;
			for( var i = 0; i < this.children.length; ++i) {
				this.children[i].position.y += amount;
			}
			break;

		case 'z':
			this.position.z += amount;
			for( var i = 0; i < this.children.length; ++i) {
				this.children[i].position.z += amount;
			}
			break;
		}
	};

	this.translateX = function( amount ) {
		this.translate( 'x', amount );
	};

	this.translateY = function( amount ) {
		this.translate( 'y', amount );
	};

	this.translateZ = function( amount ) {
		this.translate( 'z', amount );
	};

	this.removeChild = function( c ) {
		if(c != null && c != undefined && this.children.length < 1)
		{
			var i = this.children.indexOf( c );
			if(i != null)
				this.objects.splice(i, 1);
		}
	};

	this.addChild = function( c ) {
		if( c instanceof Array )
		{
			for( var i = 0; i < c.length; ++i )
				this.children.push(c[i]);
		} else if (c != null && c != undefined) {
			this.children.push(c);
		}
	};

	this.toString = function() {
		return this.type +    " [ position: " + this.position.toString() +
								", material: " + this.material.toString() + "" +
								", visible: " + this.visible.toString() +
								", rotation: " + this.rotation.toString() +
								", scale: " + this.scale.toString() +
								", matrix: " + this.matrix.toString() +
								", children: " + this.children.length + "]";
	};

	this.type = 'BLUR.Object3D';
};