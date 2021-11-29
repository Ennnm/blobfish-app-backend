const rooms = {};
const socketToRoom = {};
export default function registerRoomHandlers(io, socket) {
  // console.log('in registerRoom handlers');

  // socket.onAny((eventName, ...args) => {
  //   console.log('socket eventName :>> ', eventName);
  //   console.log('args :>> ', args);
  // });
  const joinRoom = ({ roomID, username, avatarJSON, coordinates }) => {
    if (rooms[roomID]) {
      const { length } = rooms[roomID];
      if (length === 30) {
        socket.emit('room full');
        return;
      }
      rooms[roomID].push({
        userID: socket.id,
        username,
        avatarJSON,
        coordinates,
      });
    } else {
      rooms[roomID] = [
        {
          userID: socket.id,
          username,
          avatarJSON,
          coordinates,
        },
      ];
    }
    // place user in room, user can only be in one room at a time
    socketToRoom[socket.id] = { roomID, username };
    const usersInThisRoom = rooms[roomID].filter(
      (user) => user.userID !== socket.id
    );
    console.log('usersInThisRoom :>> ', usersInThisRoom);
    socket.emit('get users', usersInThisRoom);
  };

  const sendSignalOnJoin = (payload) => {
    io.to(payload.userToSignal).emit('user joined', {
      avatarJSON: payload.avatarJSON,
      username: payload.username,
      coordinates: payload.coordinates,
      signal: payload.signal,
      callerID: payload.callerID,
    });
    console.log('send signal payload :>> ', payload);
  };
  const sendDataSignalOnJoin = (payload) => {
    io.to(payload.userToSignal).emit('user data joined', {
      avatarJSON: payload.avatarJSON,
      username: payload.username,
      coordinates: payload.coordinates,
      signal: payload.signal,
      callerID: payload.callerID,
    });
    console.log('send data signal payload :>> ', payload);
  };

  const returnSignal = (payload) => {
    io.to(payload.callerID).emit('receiving returned signal', {
      // username: payload.username,
      signal: payload.signal,
      id: socket.id,
    });
    console.log('received signal payload :>> ', payload);
  };

  const returnDataSignal = (payload) => {
    io.to(payload.callerID).emit('receiving data returned signal', {
      // username: payload.username,
      signal: payload.signal,
      id: socket.id,
    });
    console.log('received signal payload :>> ', payload);
  };
  // needed? for verification?
  const answer = (data) => {
    io.to(data.target).emit('answer', data);
    console.log('answer data :>> ', data);
  };

  const disconnectingUser = () => {
    if (socketToRoom !== undefined && socketToRoom[socket.id] !== undefined) {
      const { roomID } = socketToRoom[socket.id];
      console.log('socketToRoom :>> ', socketToRoom);
      let room = rooms[roomID];
      // need to get room id
      console.log('rooms :>> ', rooms);
      // let disconnectUserIdx = rooms[roomID].indexOf();
      let disconnectUser;
      if (room) {
        disconnectUser = room.filter((user) => user.userID === socket.id);
        room = room.filter((user) => user.userId !== socket.id);
        console.log('room :>> ', room);
        rooms[roomID] = room;
        // socket.emit('get users', rooms[roomID]);
      }
      console.log('rooms[roomID] :>> ', rooms[roomID]);
      console.log('socket.id :>> ', socket.id);
      console.log('disconnectUser :>> ', disconnectUser);
      io.sockets.emit('disconnect user', disconnectUser);
      console.log('disconnect user socket.id :>> ', socket.id);
      // transmit to all other users to remove local from their users list

      // on disconnect, send username, socket id to remove
    }
  };

  // const disconnectingUser =()=>{
  //   // get socket user
  //   const roomId = socketToRoom(socket.id);
  // }
  socket.on('joined room', joinRoom);

  socket.on('sending signal', sendSignalOnJoin);
  socket.on('sending data signal', sendDataSignalOnJoin);

  socket.on('returning signal', returnSignal);
  socket.on('returning data signal', returnDataSignal);

  socket.on('answer', answer);

  // socket.on('disconnect', disconnectingUser);
  socket.on('disconnecting', disconnectingUser);
  // socket.on('disconnecting', disconnectingUser);
}
