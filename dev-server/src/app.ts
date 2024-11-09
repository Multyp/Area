import express, { Express, Request, Response } from 'express';
import { createServer, IncomingMessage } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { URL } from 'url';
import developers from '../.developers.json';
import { randomUUID } from 'crypto';

type Developer = {
  name: string;
  secret: string;
};

type DeveloperConnection = Developer & {
  ws: WebSocket;
  isAlive: boolean;
  heartbeatInterval: NodeJS.Timeout;
  pendingResponses: Map<string, Response>;
};

const devs: Map<string, Developer> = new Map<string, Developer>(
  Object.entries(developers).map(([id, developer]) => [
    id,
    {
      name: developer.name,
      secret: developer.secret,
    },
  ])
);

const app: Express = express();
const port: number = 8083;
const devConns: Map<string, DeveloperConnection> = new Map();

app.use(express.json());

app.get('/dev/status', async (request: Request, response: Response) => {
  const payload: object = {
    status: 'up',
  };

  response.json(payload);
});

app.post('/dev/:developer_uuid/api/webhook/:service_name/:action_name', async (request: Request, response: Response) => {
  const { developer_uuid, service_name, action_name } = request.params;

  if (!devs.has(developer_uuid)) {
    return response.status(200).json({ message: 'Unauthorized' });
  }

  console.log('Webhook received:', developer_uuid, service_name, action_name);
  const devConn = devConns.get(developer_uuid);

  if (devConn) {
    const pending_response_uuid: string = randomUUID();

    const payload = {
      event: true,
      pending_response_uuid,
      service: service_name,
      action: action_name,
      headers: request.headers,
      body: request.body,
    };

    console.log('Webhook beign forwarded to:', devConn.name);
    devConn.ws.send(JSON.stringify(payload));
    devConn.pendingResponses.set(pending_response_uuid, response);
  } else {
    return response.status(200).json({ message: 'Developer not connected via WebSocket' });
  }
});

const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws: WebSocket, request: Request) => {
  const parsedUrl = new URL(request.url || '', `http://${request.headers.host}`);
  const developerUuid = parsedUrl.searchParams.get('developer_uuid');
  const developerSecret = parsedUrl.searchParams.get('developer_secret');

  if (!developerUuid || !devs.has(developerUuid) || devs.get(developerUuid)?.secret !== developerSecret) {
    ws.close(1008, 'Unauthorized');
    return;
  }

  console.log('Developer connected:', devs.get(developerUuid)?.name, developerUuid);

  const heartbeatInterval = setInterval(() => {
    if (!devConn.isAlive) {
      devConn.ws.terminate();
      devConns.delete(developerUuid);
      console.log(`Terminated inactive connection for developer_uuid: ${developerUuid}`);
    } else {
      devConn.isAlive = false;
      devConn.ws.ping();
    }
  }, 30000);

  const dev = devs.get(developerUuid);

  if (!dev || !dev.name || !dev.secret) {
    ws.close(1008, 'Unauthorized');
    return;
  }

  const devConn: DeveloperConnection = {
    ...dev,
    ws,
    isAlive: true,
    heartbeatInterval,
    pendingResponses: new Map<string, Response>(),
  };

  devConns.set(developerUuid, devConn);

  ws.send(JSON.stringify({ message: `Welcome ${devs.get(developerUuid)?.name} (${developerUuid})` }));

  ws.on('pong', () => {
    devConn.isAlive = true;
  });

  ws.on('message', (message: string) => {
    let parsed;

    try {
      parsed = JSON.parse(message);
    } catch {}

    if (parsed.event_response && devConn.pendingResponses.has(parsed.pending_response_uuid)) {
      const pendingResponse = devConn.pendingResponses.get(parsed.pending_response_uuid);

      if (pendingResponse) {
        for (let headerName in parsed.response.headers) {
          pendingResponse.set(headerName, parsed.response.headers[headerName]);
        }

        pendingResponse.status(parsed.response.status).send(parsed.response.body);
        devConn.pendingResponses.delete(parsed.response.uuid);
      }
    }
  });

  ws.on('close', () => {
    clearInterval(heartbeatInterval);
    devConns.delete(developerUuid);
    console.log(`Connection closed for developer_uuid: ${developerUuid}`);
  });
});

server.on('upgrade', (request: IncomingMessage, socket, head) => {
  const parsedUrl = new URL(request.url || '', `http://${request.headers.host}`);

  if (parsedUrl.pathname === '/dev/gateway') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request as Request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`⚡️[server]: HTTPS server running at http://0.0.0.0:${port}`);
});
