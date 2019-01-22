// 1. Load modules to create WebSocket Server, WebServer, File IO
const webSocketServer = require('ws').Server;
const http = require('http');
const fs = require('fs');

// 2. Create a WebSocket instance, and register the port 9060
const ws = new webSocketServer({ port: 9060 });

//3. Register 'connection' event to manage messages through it
ws.on('connection', function(socket, req) {
  var id = req.headers['sec-websocket-key'];
  console.log('New connection id: ', id);
  socket.send(id);

  socket.on('message', function(message){
    var id = req.headers['sec-websocket-key'];
    var ip = req.connection.remoteAddress;
    console.log('The ', message, ' Message Received \n from IP '
    + ip, ' \n from id ', id);
    socket.send('Received ' + message);
  });

  socket.on('close', function(code, reason) {
    var id = req.headers['sec-websocket-key'];
    console.log('Disconnect from id: ', id, ' code: ', code, ' reason: ', reason);
  });
});

//4. Create a web server to read HTML file, and respond to client's request
var server = http.createServer(function(req, resp) {
  fs.readFile('../pages/client.html', function(error, pgResp) {
    if(error) {
      resp.writeHead(404);
      resp.write('Contents you are looking for are not found...');
    } else {
      resp.writeHead(200, { 'Content-Type': 'text/html'});
      resp.end(pgResp);
    }
  });
});

//5. start service, listening on the port 5050
server.listen(5050);
console.log('Server started');