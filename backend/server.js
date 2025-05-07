const Message = require('./models/Message'); // add this at the top if storing messages

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a private room
  socket.on('join_room', async ({ roomId }) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);

    // Optional: Load previous messages for the room
    const messages = await Message.find({ roomId }).sort('timestamp');
    socket.emit('load_messages', messages);
  });

  // Handle sending messages to a room
  socket.on('send_message', async ({ roomId, senderId, message }) => {
    const newMsg = new Message({ roomId, senderId, message });
    await newMsg.save();

    io.to(roomId).emit('receive_message', newMsg); // ✅ only emit to the room
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
