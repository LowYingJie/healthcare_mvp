// frontend/src/pages/PrivateChat.jsx

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

const socket = io('http://localhost:5000'); // Replace with your backend

function PrivateChat() {
  const { doctorId } = useParams(); // assuming current user is a patient
  const patientId = localStorage.getItem('userId'); // get from login
  const roomId = [patientId, doctorId].sort().join('_'); // Unique room ID

  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.emit('join_room', { roomId });

    socket.on('load_messages', (msgs) => setChat(msgs));
    socket.on('receive_message', (msg) => setChat(prev => [...prev, msg]));

    return () => {
      socket.off('load_messages');
      socket.off('receive_message');
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit('send_message', {
      roomId,
      senderId: patientId,
      message
    });
    setMessage('');
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Chat with Doctor</h2>
      <div className="border h-64 overflow-y-auto p-2 bg-gray-100">
        {chat.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.senderId === patientId ? 'text-right' : 'text-left'}`}>
            <span className="inline-block bg-white px-3 py-1 rounded shadow">
              {msg.message}
            </span>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          className="flex-grow border px-2 py-1"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Message..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-1 ml-2">Send</button>
      </div>
    </div>
  );
}

export default PrivateChat;
