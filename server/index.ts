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
    const pathname = parsedUrl.pathname || '/';

    // Endpoint to emit todos:updated for clients (used by API handlers & tests)
    if (req.method === 'POST' && parsedUrl.pathname === '/__test__/ws/emit/todos-updated') {
      io?.emit('todos:updated');
      res.statusCode = 204;
      res.end();
      return;
    }

    if (req.method === 'POST' && pathname === '/__test__/db/seed') {
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

    // Minimal API handlers in dev to support App Router E2E
    if (pathname === '/api/todos' && req.method === 'GET') {
      (async () => {
        await db.read();
        const todos = db.data?.todos ?? [];
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(todos));
      })();
      return;
    }

    if (pathname === '/api/todos' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', async () => {
        try {
          const payload = JSON.parse(body || '{}');
          const title = typeof payload.title === 'string' ? payload.title.trim() : '';
          if (!title) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'title is required' }));
            return;
          }
          await db.read();
          if (!db.data) db.data = { todos: [] } as any;
          const newTodo = {
            id: (globalThis.crypto?.randomUUID?.() || Date.now().toString()) as string,
            title,
            description: '',
            dueDate: '',
            completed: false,
          };
          db.data.todos = [...db.data.todos, newTodo];
          await db.write();
          io?.emit('todos:updated');
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 201;
          res.end(JSON.stringify(newTodo));
        } catch (e) {
          res.statusCode = 400;
          res.end('Bad Request');
        }
      });
      return;
    }

    if (pathname?.startsWith('/api/todos/') && req.method === 'PATCH') {
      const id = pathname.split('/').pop() as string;
      (async () => {
        await db.read();
        if (!db.data) db.data = { todos: [] } as any;
        const idx = db.data.todos.findIndex((t) => t.id === id);
        if (idx === -1) {
          res.statusCode = 404;
          res.end('Not Found');
          return;
        }
        const current = db.data.todos[idx];
        const updated = { ...current, completed: !current.completed };
        db.data.todos[idx] = updated;
        await db.write();
        io?.emit('todos:updated');
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(updated));
      })();
      return;
    }

    if (pathname?.startsWith('/api/todos/') && req.method === 'DELETE') {
      const id = pathname.split('/').pop() as string;
      (async () => {
        await db.read();
        if (!db.data) db.data = { todos: [] } as any;
        const before = db.data.todos.length;
        db.data.todos = db.data.todos.filter((t) => t.id !== id);
        if (db.data.todos.length === before) {
          res.statusCode = 404;
          res.end('Not Found');
          return;
        }
        await db.write();
        io?.emit('todos:updated');
        res.statusCode = 204;
        res.end();
      })();
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
