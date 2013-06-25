var io 				= require('socket.io').listen(8002);

var users 			= [];
var welcome_message = 'Welcome! I hope you enjoy this tech demo. Just click to draw, or sit back and watch others. Any bugs/comments please email me@harrynorthover.com';

var totalUsers 		= 0;
var port 			= 8002;

io.sockets.on('connection', function (socket) {
	totalUsers 		   += 1;
	socket.username     = 'User' + totalUsers;
	lastPosition = [0,0,0];

	socket.on("message", function( m ){
		var msg = m.split(':');

        console.log(msg[0]);

		switch(msg[0]) {
			case 'GET_ID':
                socket.broadcast.emit('message', 'USER_CONNECTED:' + socket.id);
                socket.broadcast.emit('message', 'RECEIVE_ID:' + socket.id);
				break;

			case 'DRAW_LINE':
				// length: 11.
				var data = msg[1].split('_');
				var coords = "DRAW_LINE:";
				
				coords += data[0] + '_' + data[1] + '_' + data[2] + '_' + data[3] + '_' + data[4] + '_' + data[5] + '_' + data[6] + '_' + data[7] + '_' + data[8] + '_' + data[9] + '_' + data[9] + '_' + socket.id;

				if(socket.drawFromPreviousLine) {
					coords += '_false';
				} else {
					coords += '_true';
			        socket.drawFromPreviousLine = true;
				}

                socket.broadcast.emit( 'message', coords );
		        lastPosition = [data[3], data[4], data[5]];

				break;

			case 'UPDATE_CURSOR':
				var tmp = msg[1].split('_');
                socket.broadcast.emit( 'message', 'UPDATE_CURSOR:' + tmp[0] + '_' + tmp[1] + '_' + socket.id + '_' + socket.username );
				break;

			case 'UPDATE_NICKNAME':
				var tmp = msg[1].split('_');
				var prevN = socket.username;
				socket.username = tmp[0];

                socket.broadcast.emit( 'message', 'NEW_SERVER_MESSAGE:<b>' + prevN + '</b> changed their username to <b>' + socket.username +'</b>' );
				break;

			case 'NEW_MESSAGE':
                socket.broadcast.emit( 'message', 'NEW_MESSAGE:<b>' + socket.username + '</b> - ' + msg[1] );
				break;

			case 'INIT_NEW_LINE':
				socket.drawFromPreviousLine = false;
				break;

			default:
                socket.broadcast.emit( m );
				break;
		}

	});

	socket.on('close', function( msg )
    {
		socket.emit('USER_DISCONNECTED:' + msg.id);
	});

    socket.on("error", function()
    {
        console.log(Array.prototype.join.call(arguments, ", "));
    });

    socket.on("listening", function()
    {
        console.log("Listening for connections...");
    });

    socket.on("disconnected", function(conn)
    {
        console.log("["+conn.id+"] disconnected.");
    });
});