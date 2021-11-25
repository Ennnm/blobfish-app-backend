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

  const AvatarController = initAvatarsController(db);
  app.get('/avatars', AvatarController.index);
  app.post('/avatars', AvatarController.create);
  app.get('/avatars/:id', AvatarController.show);
  app.post('/displayAvatar', AvatarController.displayAvatar);

  const RoomController = initRoomsController(db);
  app.get('/rooms', RoomController.index);
  app.post('/rooms', RoomController.create);
  app.get('/rooms/:id', RoomController.show);
  app.delete('/rooms/:id', RoomController.destroy);

  const UserController = initUsersController(db);
  const LoginController = initLoginController(db);
  const SignUpController = initSignUpController(db);

  app.post('/signup', SignUpController.create);
  app.post('/login', LoginController.create);
  app.delete('/logout', LoginController.destroy);
  app.get('/users', UserController.index);
  app.get('/user/:id', UserController.show);
}
