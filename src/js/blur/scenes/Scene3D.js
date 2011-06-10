/*
 * Author: Harry Northover
 */

BLUR.Scene3D = function () {
	this.objects 	= [];
	this.networkObjects = [];

	this.addObject = function( object ) {
		this.objects.push(object);
	};

	this.removeObject = function( object ) {
		var index = this.objects.indexOf(object);
		if(index != null)
			this.objects.splice(index, 1);
	};
};