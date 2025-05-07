// src/pages/PrivateChat.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client'; // Import socket.io client

const socket = io('http://localhost:5000'); // Backend server URL for Socket.IO

function PrivateChat() {
  const { doctorId } = useParams(); // Get doctorId from URL params
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  // Get the current patient's ID (assumed to be in localStorage)
  const patientId = localStorage.getItem('userId'); 

  // Create a unique roomId based on patientId and doctorId
  const roomId = [patientId, doctorId].sort().join('_');  // Patient-Doctor room ID

  // Join the room and load previous messages when component mounts
  useEffect(() => {
    socket.emit('join_room', { roomId });

    socket.on('load_messages', (messages) => {
      setChat(messages);
    });

    // Listen for new incoming messages
    socket.on('receive_message', (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    // Clean up the socket listeners when the component unmounts
    return () => {
      socket.off('load_messages');
      socket.off('receive_message');
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    // Emit message to the server to be broadcasted to the room
    socket.emit('send_message', {
      roomId,
      senderId: patientId,
      message,
    });

    setMessage(''); // Clear the input field
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Chat with Doctor</h2>
      
      {/* Chat messages display */}
      <div className="border h-64 overflow-y-auto p-2 bg-gray-100 mb-4">
        {chat.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.senderId === patientId ? 'text-right' : 'text-left'}`}>
            <span className="inline-block bg-white px-3 py-1 rounded shadow">
              {msg.message}
            </span>
          </div>
        ))}
      </div>

      {/* Input and send button */}
      <div className="flex">
        <input
          className="flex-grow border px-2 py-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-1 ml-2">
          Send
        </button>
      </div>
    </div>
  );
}

export default PrivateChat;
