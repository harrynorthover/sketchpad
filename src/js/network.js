/*
 * @author Harry Northover (http://www.harrynorthover.com)
 * @description This file takes care of sending and receiving all web sockets data. The params required are an
 * 				instance of the main connected.js app so functions in that file can be called, and a reference to
 * 				the scene so lines can be draw once their received and the console object.
 */
SKETCHPAD.Network = function (b,s,c) {
	var self = this;

	this.host = "http://localhost:8002";

	this.users 			= [];
	//this.heightOffset 	= 53;
	this.scene 			= s;
	this.connected 		= b;
	this.lineIsBeingDraw = false;
	this.console 		= c;

    lines = [];
    lastPoint = null;

	var User = function(id) {
		this.id 		= id;
		this.username 	= id;
		this.lines 		= [];
		this.cursor 	= new BLUR.Particle( new BLUR.Vector(self.connected.randomNumber(200,200),
														  	  self.connected.randomNumber(200,200),
														  	  self.connected.randomNumber(200,200)), 6 );
		this.cursor.material = new BLUR.BasicColorMaterial( new BLUR.Color( 220,20,60 ),1);
		
		this.label = new BLUR.Text2D( this.username, this.cursor.position );
		this.label.material = new BLUR.BasicColorMaterial( new BLUR.Color( 245,245,245 ),0.5);

		this.currentRotation = 0;

		this.init = function() {
			self.scene.addObject(this.cursor);
			self.scene.addObject(this.label);
		};

		this.remove = function() {
			self.scene.removeObject(this.cursor);
			self.scene.removeObject(this.label);
		};
	};

    this.init = function () {
        try {
            socket = io.connect(this.host);

            socket.on('connect', function (msg) {
            	socket.send('GET_ID');
            	self.connected.hideError();
            });

            socket.on('message', function (msg) {
            	if(self.console != null) 
            		self.console.updateConsole(msg.data);
            	
            	//console.log('m: ' + msg);
            	
            	var m = msg.split(':');

                console.log('TYPE: ', m[0]);

                switch(m[0]) {

                case 'USER_CONNECTED':
                	self.addUser(m[1]);
                	break;

                case 'USER_DISCONNECTED':
                	self.removeUser(m[1]);
                	break;

                case 'DRAW_LINE':
                	self.lineIsBeingDraw = true;

                	var tmpMsg = m[1].split('_');
                	var id = tmpMsg[11];
                	var shouldDrawFromStart = tmpMsg[tmpMsg.length-1];

                	var p1 = (shouldDrawFromStart == 'true') ? new BLUR.Vector(tmpMsg[0], tmpMsg[1], tmpMsg[2]) : lastPoint;
                	var p2 = new BLUR.Vector(tmpMsg[3], tmpMsg[4], tmpMsg[5]);

                    lastPoint = p2;
                	
                    var m = new BLUR.BasicColorMaterial( new BLUR.Color( tmpMsg[6], tmpMsg[7], tmpMsg[8] ), tmpMsg[9] );

                    console.log('Material: ', m);

                    var line = new BLUR.Line(tmpMsg[10]);
                    line.material = m;

                    line.setPosition( p1, p2 );

                    // add the newly created line to the scene.
                    self.scene.addObject(line);
                    lines.push(line);

                	break;

                case 'UPDATE_CURSOR':
                	var coords = m[1].split('_');
                    console.log('CUSOR CORDS: ', coords);
                	var id = coords[2];
                	var username = coords[3];

                	var user = self.getUser( id, false );

                	user.cursor.position = new BLUR.Vector(coords[0], coords[1], 1);
                    user.cursor.material = new BLUR.BasicColorMaterial( new BLUR.Color(176,23,31),0.3);
                    user.label.position = user.cursor.position;
                    user.label.text = username;

                    console.log('cursor', user.cursor);

                	break;

                case 'RECEIVE_ID':
                	self.id = m[1];
                	self.connected.updateNickname(self.id);
                	break;

                case 'NEW_MESSAGE':
                	var message = m[1];
                	self.connected.addMessage(message);
                	self.connected.chat('show');
                	break;

                case 'NEW_SERVER_MESSAGE':
                	self.connected.addServerMessage( m[1]);
                	self.connected.chat('show');
                	break;
                }
            });

            socket.on('close', function (msg) {
            	self.connected.showError();
            });
        }
        catch (ex) {
            console.log('EXCEPTION: ' + ex);
        }
    };

    this.addUser = function( id ) {
    	var u = new User(id);
    	u.lines = [];
    	u.init();
    	this.users.push(u);
    	self.connected.updateUserAmount(this.users.length);

        console.log('Adding USer! ', u);

    	return this.users.length-1;
    };

    this.removeUser = function( id ) {
    	for(var i = 0; i < this.users.length; ++i) {
    		if(id == this.users[i].id) {
    			/*
    			 * Tell the user object to remove their cursor and username objects from
    			 * the scene.
    			 */
    			this.users[i].remove();
    			this.users.splice(i, 1);
    		}
    	}
    	self.connected.updateUserAmount(this.users.length);
    };

    this.removeAllUsers =function() {
    	for(var i = 0; i < this.users.length; ++i) {
    		this.users[i].remove();
    		this.users.splice(i, 1);
    	}
    };
    
    this.getUser = function( id ) {
    	var userExists = false;
    	/*
    	 * Check all existing users in the array and see if their id's match the one
    	 * passed in above.
    	 */
    	for(var i = 0; i < this.users.length; ++i) {
    		if(this.users[i].id == id) {
    			userExists = true;
    			return this.users[i];
    		}
    	}
    	/* If user doesn't exist then create a new one.  */
    	if(!userExists) {
    		var user = this.addUser(id);
    		return this.users[user];
    		// return this.users[this.addUser(id)];
    	}
    };

    this.addLine = function (line) {
        var p1 = line.position,
       		p2 = line.to,
        	t = line.thickness/*,
        	r = line.rotation*/;
        
        var mat = line.material.color.r + '_' + line.material.color.g + '_' + line.material.color.b + '_' + line.material.alpha;
        console.log('mat: ' + mat);
        
        var msg = "DRAW_LINE:" + Math.round(p1.x) + '_' + Math.round(p1.y) + '_' + Math.round(p1.z) + '_' + Math.round(p2.x) + '_' + Math.round(p2.y) + '_' + Math.round(p2.z) + '_' + mat + '_' + t /*+ '_' + r[0]*/;
        console.log('msg: ' + msg);
        
        this.send(msg);
    };

    this.updateCursorPosition = function(x,y) {
    	var msg = 'UPDATE_CURSOR:' + x + '_' + y;
    	this.send(msg);
    };

    this.updateNickname = function(newName) {
    	this.send('UPDATE_NICKNAME:' + newName);
    };

    this.sendMessage = function(message) {
    	this.send('NEW_MESSAGE:' + message);
    };

    this.initNewLine = function() {
    	this.send('INIT_NEW_LINE:');
    };
    
    this.send = function(data) {
    	try {
            socket.emit('message',data);
        } catch(exp) {
            console.log('* Socket Exception: ' + exp.message);
        }
    };
};