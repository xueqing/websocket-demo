const express = require('express');
const webSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new webSocket.Server({server});

// kiki: add
wss.on('connection', function(socket, req) {
  var id = req.headers['sec-websocket-key'];
  console.log('A new connection--id: ', id);
  
  socket.on('message', function(message){
    var ip = req.connection.remoteAddress;
    console.log('Message Received--IP: ', ip, '; id: ', id);
    console.log('Message Received--Message: ', message);

    var obj = JSON.parse(message);
    var msgtype = obj.msgtype;
    console.log('Message Received--MessageType: ', msgtype);

    var resp;

    switch(msgtype) {
      case "getrooms":
        resp = {
          "code": 200,
          "rooms": [
            {
                "name": "room1",
                "_id": "30121g51113e74fff3115501"
            },
            {
                "name": "room2",
                "_id": "30121g51113e74fff3115502"
            }
          ]
        }
        break;
      case "createroom":
        resp = {
          "code": 200,
          "roomid": "30121g51113e74fff3115501"
        }
        break;
      case "createtoken":
        resp = {
          "code": 200,
          "token": "531b26113e74ee30500001"
        }
        break;
      case "getroomusers":
        resp = {
          "code": 200,
          "users": [
              {
                  "name": "user1",
                  "role": "teacher"
              },
              {
                  "name": "user2",
                  "role": "student"
              }
          ]
        }
        break;
      default:
        resp = {
          "code": 400
        }
        break;
    }

    console.log('After process resp: ', JSON.stringify(resp));
    socket.send(JSON.stringify(resp));
  });

  socket.on('close', function(code, reason) {
    var id = req.headers['sec-websocket-key'];
    console.log('Disconnect from id: ', id, ' code: ', code, ' reason: ', reason);
  });

  socket.send('Hi there, I am a websocket server');
});

var port = 3000;
server.listen(port, function() {
  console.log('Server start, listening on the port ', port);
});