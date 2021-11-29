const users = {};
const socketToRoom = {};
export default function registerRoomHandlers(io, socket) {
  // console.log('in registerRoom handlers');

  socket.onAny((eventName, ...args) => {
    console.log('socket eventName :>> ', eventName);
    console.log('args :>> ', args);
  });
  const joinRoom = ({ roomID, username, avatarJSON, coordinates }) => {
    if (users[roomID]) {
      const { length } = users[roomID];
      if (length === 30) {
        socket.emit('room full');
        return;
      }
      users[roomID].push({
        userID: socket.id,
        username,
        avatarJSON,
        coordinates,
      });
    } else {
      users[roomID] = [
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
    const usersInThisRoom = users[roomID].filter(
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

  const returnSignal = (payload) => {
    io.to(payload.callerID).emit('receiving returned signal', {
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
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
      socket.emit('get users', users[roomID]);
    }
    console.log('disconnect user socket.id :>> ', socket.id);
    // transmit to all other users to remove local from their users list
  };

  // const disconnectingUser =()=>{
  //   // get socket user
  //   const roomId = socketToRoom(socket.id);
  // }
  socket.on('joined room', joinRoom);

  socket.on('sending signal', sendSignalOnJoin);

  socket.on('returning signal', returnSignal);

  socket.on('answer', answer);

  socket.on('disconnect', disconnectingUser);
  socket.on('disconnecting', disconnectingUser);
  // socket.on('disconnecting', disconnectingUser);
}
