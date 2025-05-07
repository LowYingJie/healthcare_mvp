// server.js

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
const Message = require('./models/Message');  // Message model for chat

const app = express();
const server = http.createServer(app);  // Create server for socket.io

const io = new Server(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());  // Allow handling JSON requests

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);

// MongoDB connection using Mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT || 5000, () => {
      console.log('✅ Server is running on port', process.env.PORT || 5000);
    });
  })
  .catch((err) => console.log('❌ MongoDB connection error:', err));

// Socket.IO private chat logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join private room
  socket.on('join_room', async ({ roomId }) => {
    socket.join(roomId);  // Join room based on unique roomId (patient-doctor pair)
    console.log(`User joined room: ${roomId}`);

    // Load previous messages for the room
    try {
      const messages = await Message.find({ roomId }).sort('timestamp');
      socket.emit('load_messages', messages);  // Send history to the user
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  });

  // Send new message to the room
  socket.on('send_message', async ({ roomId, senderId, message }) => {
    try {
      const newMessage = new Message({ roomId, senderId, message });
      await newMessage.save();  // Save message in MongoDB
      io.to(roomId).emit('receive_message', newMessage);  // Emit message to the room
    } catch (err) {
      console.error('Error sending message:', err);
    }
  });

  // User disconnects
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
