const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointment');
const userRoutes = require('./routes/user');

// Import model for chat messages
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(5000, () => console.log('✅ Server running on http://localhost:5000'));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Socket.IO private chat logic
io.on('connection', (socket) => {
  console.log('📡 User connected:', socket.id);

  // Join a private room (doctor-patient pair)
  socket.on('join_room', async ({ roomId }) => {
    socket.join(roomId);
    console.log(`✅ Joined room: ${roomId}`);

    // Send previous messages from DB
    try {
      const messages = await Message.find({ roomId }).sort('timestamp');
      socket.emit('load_messages', messages);
    } catch (err) {
      console.error('Error loading messages:', err.message);
    }
  });

  // Handle sending a message
  socket.on('send_message', async ({ roomId, senderId, message }) => {
    try {
      const newMsg = await new Message({ roomId, senderId, message }).save();
      io.to(roomId).emit('receive_message', newMsg);
    } catch (err) {
      console.error('Error saving message:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});
