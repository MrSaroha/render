const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

let espClient = null;
let appClient = null;

wss.on('connection', (ws) => {
  console.log('🔌 New client connected');

  ws.on('message', (message) => {
    console.log("📨 Message:", message);

    if (message === 'ESP32') {
      espClient = ws;
      ws.send("ESP32 registered");
    } else if (message === 'APP') {
      appClient = ws;
      ws.send("APP registered");
    } else {
      // Forward APP → ESP32
      if (ws === appClient && espClient) {
        console.log("➡️ Forwarding to ESP32:", message);
        espClient.send(message);
      }
    }
  });

  ws.on('close', () => {
    if (ws === espClient) espClient = null;
    if (ws === appClient) appClient = null;
    console.log('❌ Client disconnected');
  });
});
