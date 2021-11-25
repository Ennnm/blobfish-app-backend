import express from 'express';
import { createServer } from 'http';

import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import { Server } from 'socket.io';
import cors from 'cors';
import bindRoutes from './routes.mjs';
import registerRoomHandlers from './registerRoomHandlers.mjs';

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

const onConnection = (socket) => {
  console.log('client connected', socket.id);

  registerRoomHandlers(io, socket);
};

io.on('connection', onConnection);

server.listen(PORT, () => {
  console.log(`${PORT} is on`);
});
