import express from 'express';
import { createServer } from 'http';

import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import bindRoutes from './routes.mjs';
import registerRoomAudio from './registerRoomAudio.mjs';
import registerRoomMove from './registerRoomMove.mjs';

// import bindRoutes from './routes.mjs';

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://blobfish-app.netlify.app';
const app = express();
const jsonParser = bodyParser.json();
app.use(jsonParser);
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'HEAD'],
    credentials: true,
  },
});

app.use(cors());

const PORT = process.env.PORT || 3002;
app.get('/', (req, res) => {
  res.send('running');
});

app.get('/cors', (req, res) => {
  res.set('Access-Control-Allow-Origin', 'https://sleepy-plateau-69754.herokuapp.com/');
  res.send({ msg: 'This has CORS enabled 🎈' });
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

  registerRoomAudio(io, socket);
  registerRoomMove(io, socket);
};

io.on('connection', onConnection);

server.listen(PORT, () => {
  console.log(`${PORT} is on`);
});
