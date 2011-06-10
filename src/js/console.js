/**
 * The console used to send network commands. 
 */

SKETCHPAD.Terminal = function() {
	command = '',
	net = null,
	isEnabled = false,
	isShowing = false;
	
	this.init = function() { };
	
	this.enable = function() {
		isEnabled = true;
	};
	
	this.disable = function() {
		isEnabled = false;
	};
	
	this.setNetworkInterface = function(n) {
		net = n;
	};
	
	this.updateConsole = function(message) {
		if(this.consoleEnabled && message != 'help') {
			document.getElementById('serverOutput').innerHTML += '' + message + '<br>';
			document.getElementById('serverOutput').scrollTop = document.getElementById('serverOutput').scrollHeight;
		}
	};
	
	this.display = function() {
		console.log('isShowing: ' + isShowing);
		if(isShowing) this.hide();
		else this.show();
	};
	
	this.show = function() {
		$('#serverOutput, #commandTxtBox, #serverHelp').fadeIn('fast');
		isShowing = true;
	};
	
	this.hide = function() {
		$('#serverOutput, #commandTxtBox, #serverHelp').fadeOut('fast');
		isShowing = false;
	};
	
	this.sendCommand = function(c) {
		switch(c) {
		case 'enable':
			this.consoleEnabled = true; 
			this.updateConsole('Console Enabled.');
			break;
		case 'disable':
			this.consoleEnabled = false;
			this.updateConsole('Console False.');
			this.show();
			break;
		case 'help':
			var drawing = '<p><b>DRAW_LINE: x1_y1_z1_x2_y2_z2_rgba[r,g,b,a]_opacity_id_false</b><br>The last 2 parameters are not required.</p>';
			var nickname = '<p><b>UPDATE_NICKNAME:nickname</b><br>Updates your nickname.</p>';
			var cursor = '<p><b>UPDATE_CURSOR:x_y_z</b><br>Updates your cursor position on other clients.</p>';
			var message = '<p><b>NEW_MESSAGE:<i>nickname</i> - <i>message</i></b><br>Sends a message that appears in the chat window.</p>';
			this.updateConsole(drawing+nickname+cursor+message);
			break;
		default:
			net.sendCommand(c);
			this.updateConsole(c);
			break;
		}
	};
}