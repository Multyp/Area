import WebSocket from 'ws';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiBaseUrl: string = process.env.API_BASE_URL as string;
const developerUuid: string = process.env.DEVELOPER_UUID as string;
const developerSecret: string = process.env.DEVELOPER_SECRET as string;

if (!apiBaseUrl || !developerUuid || !developerSecret) {
  console.error('DEVELOPER_UUID is missing from the environment variables.');
  process.exit(1);
}

let ws: WebSocket;

async function connectWebSocket() {
  ws = new WebSocket(`wss://rooters-area.com/dev/gateway?developer_uuid=${developerUuid}&developer_secret=${developerSecret}`);

  ws.on('open', () => {
    console.log(`Connected to WebSocket server as developer_uuid: ${developerUuid}`);

    setInterval(() => {
      ws.ping();
    }, 30000);
  });

  ws.on('message', async (data: string) => {
    try {
      const jsonMessage = JSON.parse(data);
      const { event, pending_response_uuid, service, action, headers, body } = jsonMessage;

      if (!event || !pending_response_uuid) {
        console.log(jsonMessage);
        return;
      }

      const webhookUrl = `${apiBaseUrl}/api/webhook/${service}/${action}`;
      delete headers['content-length'];
      const response = await axios.post(webhookUrl, body, {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      });

      ws.send(
        JSON.stringify({
          event_response: true,
          pending_response_uuid,
          response: {
            status: response.status,
            headers: response.headers,
            body: response.data,
          },
        })
      );

      console.log(`[dev-client proxy] Forwarded a new webhook to ${webhookUrl}. Response status: ${response.status}`);
    } catch {}
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed. Attempting to reconnect in 2 seconds...');
    setTimeout(connectWebSocket, 2000);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
}

connectWebSocket();
