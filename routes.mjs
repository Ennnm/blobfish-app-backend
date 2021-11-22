import db from './models/index.mjs';

// import your controllers here
import initUsersController from './controllers/users.mjs';
import initAvatarsController from './controllers/avatars.mjs';
import initRoomsController from './controllers/rooms.mjs';

import initSignUpController from './controllers/signups.mjs';
import initLoginController from './controllers/logins.mjs';

export default function bindRoutes(app) {
  // initialize the controller functions here
  // pass in the db for all callbacks
  // define your route matchers here using app
  const UserController = initUsersController(db);
  app.get('/users', UserController.index);
  app.post('/users', UserController.create);
  app.get('/users/:id', UserController.show);

  const AvatarController = initAvatarsController(db);
  app.get('/avatars', AvatarController.index);
  app.post('/avatars', AvatarController.create);
  app.get('/avatars/:id', AvatarController.show);

  const RoomController = initRoomsController(db);
  app.get('/rooms', RoomController.index);
  app.post('/rooms', RoomController.create);
  app.get('/rooms/:id', RoomController.show);

  const LoginController = initLoginController(db);
  const SignUpController = initSignUpController(db);

  app.post('/signup', SignUpController.create);
  app.post('/login', LoginController.create);
  app.delete('/logout', LoginController.destroy);
  app.get('/user/:id', UserController.show);
  app.put('/user/:id/update', UserController.update);
}
