let serverUrl = '/';
let ws;
let localStream;
let room;
let roomid;
let token;

function printText(text) {
  document.getElementById('messages').value += `- ${text}\n`;
};

// window.onload = () => {
  // const config = { audio: true, video: true, data: true };
  // var localStream = Erizo.Stream(config);
  // var room = Erizo.Room({token: 'eyJ0b2tlbklkIjoiNWM0OTFlY2UxMDllZTFmYTUxNTgzNjZjIiwiaG9zdCI6IjE5Mi4xNjguMS4xNDA6ODA4MCIsInNlY3VyZSI6ZmFsc2UsInNpZ25hdHVyZSI6Ik9EWmxOakZoTW1KaVpHWmpOR0kxWWpZM1ptSmpPV0UwWWprd05EZzJZakE1TnpJeFl6Y3daZz09In0='});

  // localStream.addEventListener('access-accepted', function () {

  //     var subscribeToStreams = function (streams) {
  //         for (var index in streams) {
  //           var stream = streams[index];
  //           if (localStream.getID() !== stream.getID()) {
  //               room.subscribe(stream);
  //           }
  //         }
  //     };

  //     room.addEventListener('room-connected', function (roomEvent) {

  //         room.publish(localStream);
  //         subscribeToStreams(roomEvent.streams);
  //     });

  //     room.addEventListener('stream-subscribed', function(streamEvent) {
  //         var stream = streamEvent.stream;
  //         var div = document.createElement('div');
  //         div.setAttribute('style', 'width: 320px; height: 240px;');
  //         div.setAttribute('id', 'test' + stream.getID());

  //         document.body.appendChild(div);
  //         stream.play('test' + stream.getID());
  //     });

  //     room.addEventListener('stream-added', function (streamEvent) {
  //         var streams = [];
  //         streams.push(streamEvent.stream);
  //         subscribeToStreams(streams);
  //     });

  //     room.addEventListener('stream-removed', function (streamEvent) {
  //         // Remove stream from DOM
  //         var stream = streamEvent.stream;
  //         if (stream.elementID !== undefined) {
  //             var element = document.getElementById(stream.elementID);
  //             document.body.removeChild(element);
  //         }
  //     });

  //     // room.connect();
  //     localStream.play('myVideo');
  // });
  // localStream.init();
// };

function connectWS() {
  var wsprotocol = document.getElementById('protocol').value;
  var wshost = document.getElementById('host').value;
  var wsport = document.getElementById('port').value;
  var wsendpoint = document.getElementById('endpoint').value;
  serverUrl = wsprotocol + '://' + wshost + ':' + wsport + wsendpoint;
  console.log('connectWS::Connect to: ', serverUrl);

  try {
    ws = new WebSocket(serverUrl);

    ws.onopen = (evt) => {
      onWSOpen(evt);
    };
    ws.onmessage = (evt) => {
      onWsMessage(evt);
    };
    ws.onclose = (evt) => {
      onWSClose(evt);
    };
    ws.onerror = (evt) => {
      onWSError(evt);
    };
  } catch (error) {
    console.error(error );
  }
};

// ---------------API about ws---------------
const onWSOpen = (evt) => {
  console.log('WebSocket Open: ', JSON.stringify(evt, null, 4));

  document.getElementById('btnConnect').disabled = true;
  document.getElementById('btnDisconnect').disabled = false;
  document.getElementById('btnCreateRoom').disabled = false;
  document.getElementById('btnCreateToken').disabled = true;
};

const onWsMessage = (evt) => {
  try {
    var message = JSON.parse(evt.data);
    var msgtype = message.msgtype;       
    if(message.code != 200) {
      alert(msgtype, ' error happened: ', message.code);
    }

    console.log('connectWS::Message Received--MessageType: ', msgtype);

    switch(msgtype) {
      case 'getrooms':
        onGetrooms(message);
        break;
      case 'createroom':
        onCreateroom(message);
        break;
      case 'createtoken':
        onCreatetoken(message);
        break;
      case 'getroomusers':
        onGetroomusers(message);
        break;
      default:
        onBadmessage(message);
        break;
    }
  } catch (error) {
    console.log('connectWS::Received unknown message: ',
    evt.data, '; err:', error);
  }
};

const onWSClose = (evt) => {
  console.log('WebSocket Close: ', JSON.stringify(evt, null, 4));

  document.getElementById('btnConnect').disabled = true;
  document.getElementById('btnDisconnect').disabled = false;
  document.getElementById('btnCreateRoom').disabled = true;
  document.getElementById('btnCreateToken').disabled = true;
};

const onWSError = (evt) => {
  console.log('WebSocket Error: ', JSON.stringify(evt, null, 4));
};

// ---------------API about ws---------------

// ---------------request to ws server---------------
const createRoom = () => {
  var roomname = document.getElementById('roomname').value;
  console.log('createRoom::roomname: ', roomname)
  var req = {
    'msgtype': 'createroom',
    'roomname': roomname
  };
  ws.send(JSON.stringify(req));
};

const createToken = () => {
  var username = document.getElementById('username').value;
  var userrole = document.getElementById('userrole').value;
  console.log('createToken::username: ', username, '; userrole: ', userrole);
  var req = {
    'msgtype': 'createtoken',
    'roomid': roomid,
    'username': username,
    'userrole': userrole
  };
  ws.send(JSON.stringify(req));
}
// ---------------request to ws server---------------

// ---------------API about licode---------------
const onGetrooms = (res) => {
  var rooms = res.rooms;
  for(var i in rooms) {
    console.log('onGetrooms::Room ', i, ':', rooms[i].name);
  }
};

const onCreateroom = (res) => {
  roomid = res.roomid;
  document.getElementById('btnCreateToken').disabled = false;
  console.log('onCreateroom::roomid: ', roomid);
};

const onCreatetoken = (res) => {
  token = res.token;
  console.log('onCreatetoken::token: ', token);
};

const onGetroomusers = (res) => {
  var users = res.users;
  for(var i in users) {
    console.log('onGetroomusers::User ', i, ':', users[i].name);
  }
};

const onBadmessage = (res) => {
  console.log('onBadmessage::message: ', res);
};
// ---------------API about licode---------------