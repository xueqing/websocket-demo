let serverUrl = '/';
let ws;
let localStream;
let myRoom;
let myRoomId;
let myToken;
let slideShowMode = false;

function printText(text) {
  document.getElementById('messages').value += `- ${text}\n`;
};

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
    'roomid': myRoomId,
    'username': username,
    'userrole': userrole
  };
  ws.send(JSON.stringify(req));
}

const startChat = () => {
  const config = { video: true };
  localStream = Erizo.Stream(config);
  myRoom = Erizo.Room({ token: myToken });

  const subscribeToStreams = (streams) => {
    const cb = (evt) => {
      console.log('Bandwidth Alert', evt.msg, evt.bandwidth);
    };

    streams.forEach((stream) => {
      if (localStream.getID() !== stream.getID()) {
        myRoom.subscribe(stream, { slideShowMode, metadata: { type: 'subscriber' } });
        stream.addEventListener('bandwidth-alert', cb);
      }
    });
  };

  myRoom.addEventListener('room-connected', (roomEvent) => {
    printText('Connected to the room OK');
    const options = { maxVideoBW: 300, metadata: { type: 'publisher' } };
    myRoom.publish(localStream, options);
    subscribeToStreams(roomEvent.streams);
  });

  myRoom.addEventListener('stream-subscribed', (streamEvent) => {
    printText('Subscribed remote stream OK');
    const stream = streamEvent.stream;
    const div = document.createElement('div');
    div.setAttribute('id', `${stream.getID()}`);
    div.setAttribute('type', 'video');
    div.setAttribute('style', 'float:left;');

    document.getElementById('videoContainer').appendChild(div);
    stream.show(`${stream.getID()}`);
  });

  myRoom.addEventListener('stream-added', (streamEvent) => {
    printText('Local stream published OK');
    const streams = [];
    streams.push(streamEvent.stream);
    subscribeToStreams(streams);
  });

  myRoom.addEventListener('stream-removed', (streamEvent) => {
    // Remove stream from DOM
    const stream = streamEvent.stream;
    if (stream.elementID !== undefined) {
      const element = document.getElementById(stream.elementID);
      document.getElementById('videoContainer').removeChild(element);
    }
  });

  myRoom.addEventListener('stream-failed', () => {
    console.log('Stream Failed, disconnect');
    printText('Stream Failed, disconnect');
    myRoom.disconnect();
  });

  const div = document.createElement('div');
  div.setAttribute('id', 'localVideo');
  div.setAttribute('type', 'video');
  div.setAttribute('style', 'float:left');
  document.getElementById('videoContainer').appendChild(div);

  localStream.addEventListener('access-accepted', () => {
    printText('Get local Mic and Cam');

    myRoom.connect();
    localStream.play('localVideo');
  }, (error) => {
    console.log('Error happened: ', error);
  });
  localStream.init();
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
  myRoomId = res.roomid;
  document.getElementById('btnCreateToken').disabled = false;
  console.log('onCreateroom::roomid: ', myRoomId);
};

const onCreatetoken = (res) => {
  myToken = res.token;
  console.log('onCreatetoken::token: ', myToken);
  document.getElementById('btnStartChat').disabled = false;
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