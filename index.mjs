import express from 'express';
import { createServer } from 'http';

import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import bindRoutes from './routes.mjs';

// import bindRoutes from './routes.mjs';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const app = express();
const jsonParser = bodyParser.json();
app.use(jsonParser);
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
const users = {};
const socketToRoom = {};

// Set the Express view engine to expect EJS templates
app.set('view engine', 'ejs');
// Bind cookie parser middleware to parse cookies in requests
app.use(cookieParser());
// Bind Express middleware to parse request bodies for POST requests
app.use(express.urlencoded({ extended: false }));
// Bind Express middleware to parse JSON request bodies
app.use(express.json());
// Bind method override middleware to parse PUT and DELETE requests sent as POST requests
app.use(methodOverride('_method'));
// Expose the files stored in the public folder
app.use(express.static('public'));

// Bind route definitions to the Express application
bindRoutes(app);

io.on('connection', (socket) => {
  console.log('client connected', socket.id);
  socket.on('joined room', (roomID) => {
    if (users[roomID]) {
      const { length } = users[roomID];
      if (length === 4) {
        socket.emit('room full');
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);
    console.log(usersInThisRoom);
    socket.emit('get users', usersInThisRoom);
  });

  socket.on('sending signal', (payload) => {
    io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
  });

  socket.on('returning signal', (payload) => {
    io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
  });

  socket.on('answer', (data) => {
    io.to(data.target).emit('answer', data);
  });

  socket.on('disconnect', () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
    }
  });
});

server.listen(PORT, () => {
  console.log(`${PORT} is on`);
});
