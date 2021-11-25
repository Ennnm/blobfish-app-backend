const users = {};
const socketToRoom = {};
export default function registerRoomHandlers(io, socket) {
  console.log('in registerRoom handlers');

  socket.onAny((eventName, ...args) => {
    console.log('socket eventName :>> ', eventName);
    console.log('args :>> ', args);
  });
  const joinRoom = (roomID) => {
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
    console.log('usersInThisRoom :>> ', usersInThisRoom);
    socket.emit('get users', usersInThisRoom);
  };

  const sendSignalOnJoin = (payload) => {
    io.to(payload.userToSignal).emit('user joined', {
      signal: payload.signal,
      callerID: payload.callerID,
    });
    console.log('send signal payload :>> ', payload);
  };

  const returnSignal = (payload) => {
    io.to(payload.callerID).emit('receiving returned signal', {
      signal: payload.signal,
      id: socket.id,
    });
    console.log('received signal payload :>> ', payload);
  };

  const answer = (data) => {
    io.to(data.target).emit('answer', data);
    console.log('answer data :>> ', data);
  };

  const disconnectUser = () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
    }
    console.log('disconnect user socket.id :>> ', socket.id);
  };
  socket.on('joined room', joinRoom);

  socket.on('sending signal', sendSignalOnJoin);

  socket.on('returning signal', returnSignal);

  socket.on('answer', answer);

  socket.on('disconnect', disconnectUser);
}
