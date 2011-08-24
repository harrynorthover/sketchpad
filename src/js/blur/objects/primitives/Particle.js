BLUR.Particle = function( radius ) {
	BLUR.Object3D.call();

	this.radius = radius;
	this.type = 'BLUR.Particle';
};

BLUR.Particle.prototype = new BLUR.Object3D();
BLUR.Particle.prototype.constructor = new BLUR.Particle;