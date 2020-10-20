var ws = new WebSocket("ws://localhost:8001/echo")

ws.onopen = function(evt) {
  console.log("Open a connection......")
  ws.send("Hello, I am WebSocket client!")
};

ws.onmessage = function(evt) {
  console.log("Received message: ", evt.data)
  ws.close();
};

ws.onerror = function(evt) {
  console.log("Occur an error: ", evt.data)
};

ws.onclose = function(evt) {
  console.log("Close the connection!!!!!!")
};

function WebSocketTest() {
  if ("WebSocket" in window) {
    alert("WebSocket is supported by your browser!")
  }
  else {
    alert("WebSocket is not supported!!!")
  }
}