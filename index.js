const WebSocket = require('ws');

const rooms = {};
const users = {};

let i = 0;

const server = new WebSocket.Server({ port: 8080 }, () => {
    console.log('Server started');
});
server.on('connection', (socket) => {
	let id = i++;
	users[id] = socket;
	socket.on('message', (data) => {
		console.log('Data received from id %d:\n%o', id, data);
		if (typeof data == 'string' && data.startsWith('!!!')) {
			// room stuff
		} else {
			for (let otherId in users) {
				if (otherId != id) {
					console.log("Forwarding data to id %d", otherId);
					users[otherId].send(data);
				}
			}
		}
	});
	socket.on('open', () => {
	   console.log('Client connection opened');
	});
	socket.on('close', (code, reason) => {
	   console.log('Client connection closed. Code: %d, Reason: %s', code, reason);
	   delete users[id];
	});
	socket.on('error', (error) => {
	   console.log('Client connection error: %o', error);
	   delete users[id];
	});
});
server.on('listening', () => {
   console.log('Listening on 8080');
});
server.on('close', () => {
   console.log('Server closed');
});
server.on('error', (error) => {
   console.log('Server error: %o', error);
});