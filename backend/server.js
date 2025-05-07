const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointment');
const userRoutes = require('./routes/user');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT || 5000, () => console.log('Server is running on port 5000'));
  })
  .catch((err) => console.log('MongoDB connection error:', err));

// Socket.IO private chat logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join private room
  socket.on('join_room', async ({ roomId }) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);

    // Load previous chat messages
    try {
      const messages = await Message.find({ roomId }).sort('timestamp');
      socket.emit('load_messages', messages);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  });

  // Handle sending messages
  socket.on('send_message', async ({ roomId, senderId, message }) => {
    try {
      const newMessage = new Message({ roomId, senderId, message });
      await newMessage.save();
      io.to(roomId).emit('receive_message', newMessage);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
