import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import { db } from '../src/lib/database';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  let io: Server;
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);

    // Test-only endpoint to emit todos:updated for E2E
    if (
      process.env.E2E_TESTING === '1' &&
      req.method === 'POST' &&
      parsedUrl.pathname === '/__test__/ws/emit/todos-updated'
    ) {
      io?.emit('todos:updated');
      res.statusCode = 204;
      res.end();
      return;
    }

    if (
      process.env.E2E_TESTING === '1' &&
      req.method === 'POST' &&
      parsedUrl.pathname === '/__test__/db/seed'
    ) {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', async () => {
        try {
          const payload = JSON.parse(body || '{}');
          const todos = Array.isArray(payload.todos) ? payload.todos : [];
          await db.read();
          db.data = { todos } as any;
          await db.write();
          res.statusCode = 204;
          res.end();
        } catch (e) {
          res.statusCode = 400;
          res.end('Bad Request');
        }
      });
      return;
    }

    handle(req, res, parsedUrl);
  });

  io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log('a user connected');
  });

  httpServer
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    })
    .on('error', (err) => {
      console.error(err);
      process.exit(1);
    });
});
