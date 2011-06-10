var sys = require("sys");
var ws = require('websocket-server');

var server = ws.createServer({debug: true});

var users = [];
var welcome_message = 'Welcome! I hope you enjoy this tech demo. Just click to draw, or sit back and watch others. Any bugs/comments please email me@harrynorthover.com';

var totalUsers = 0;

server.addListener("connection", function(conn) {
	// When a message is received, broadcast it too all the clients
	// that are currently connected.
	// server.send(conn.id, 'NEW_SERVER_MESSAGE:' + welcome_message);

	totalUsers 		   += 1;
	conn.username 		= 'User' + totalUsers;
	conn.lastPosition 	= [0,0,0];

	conn.addListener("message", function( m ){
		var msg = m.split(':');
		switch(msg[0]) {
			case 'GET_ID':
				conn.broadcast('USER_CONNECTED:' + conn.id);
				server.send(conn.id, 'RECEIVE_ID:' + conn.id);
				break;

			case 'DRAW_LINE':
				var data = msg[1].split('_');
				var lp = conn.lastPosition;
				var coords = "DRAW_LINE:";

				coords += data[0] + '_' + data[1] + '_' + data[2] + '_' + data[3] + '_' + data[4] + '_' + data[5] + "_" + data[6] + '_' + data[7] + '_' + conn.id;

				// send coords here.
				if(conn.drawFromPreviousLine) {
					coords += '_false';
				} else {
					coords += '_true';
			        conn.drawFromPreviousLine = true;
				}

		        conn.broadcast( coords );
		        conn.lastPosition = [data[3], data[4], data[5]];

				break;

			case 'UPDATE_CURSOR':
				var tmp = msg[1].split('_');
				conn.broadcast( 'UPDATE_CURSOR:' + tmp[0] + '_' + tmp[1] + '_' + conn.id + '_' + conn.username );
				break;

			case 'UPDATE_NICKNAME':
				var tmp = msg[1].split('_');
				var prevN = conn.username;
				conn.username = tmp[0];

				conn.broadcast( 'NEW_SERVER_MESSAGE:<b>' + prevN + '</b> changed their username to <b>' + conn.username +'</b>' );
				break;

			case 'NEW_MESSAGE':
				server.broadcast( 'NEW_MESSAGE:<b>' + conn.username + '</b> - ' + msg[1] );
				break;

			case 'INIT_NEW_LINE':
				conn.drawFromPreviousLine = false;
				break;

			default:
				conn.broadcast( m );
				break;
		}

	});
	conn.addListener('close', function( msg ) {
		conn.broadcast('USER_DISCONNECTED:' + conn.id);
	});
});

server.addListener("error", function() {
	console.log(Array.prototype.join.call(arguments, ", "));
});

server.addListener("listening", function(){
	console.log("Listening for connections...");
});

server.addListener("disconnected", function(conn){
	console.log("["+conn.id+"] disconnected.");
});

server.listen(8002);