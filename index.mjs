import express from 'express';
import { createServer } from 'http';

import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import { Server } from 'socket.io';

import cors from 'cors';
// import bindRoutes from './routes.mjs';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', (req, res) => {
  res.send('running');
});

io.on('connection', (socket) => {
  console.log('client connected', socket.id);

  socket.emit('me', socket.id);
  socket.on('disconnect', () => {
    socket.broadcast.emit('disconnected');
  });

  socket.on('callUser', ({
    userToCall, signalData, from, name,
  }) => {
    io.to(userToCall).emit('callUser', { signal: signalData, from, name });
  });

  socket.in('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });
});
app.listen(PORT);
server.listen(PORT, () => {
  console.log(`${PORT} is on`);
});
