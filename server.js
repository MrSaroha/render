// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

let espClient = null;
let appClient = null;

wss.on('connection', (ws) => {
  console.log('🔌 Client connected');

  ws.on('message', (message) => {
    console.log('📨 Message:', message);

    if (message === 'ESP32') {
      espClient = ws;
      ws.send('ESP32 connected');
    } else if (message === 'APP') {
      appClient = ws;
      ws.send('App connected');
    } else {
      // Relay message to ESP32
      if (ws === appClient && espClient) {
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
