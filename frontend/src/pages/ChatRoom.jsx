// frontend/src/pages/ChatRoom.jsx

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // replace with your backend URL

function ChatRoom() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit('send_message', { text: message, timestamp: new Date() });
    setMessage('');
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat(prev => [...prev, data]);
    });

    return () => socket.off('receive_message');
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Live Chat</h2>
      <div className="border p-4 h-64 overflow-y-scroll bg-gray-50 mb-4">
        {chat.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <span className="text-sm text-gray-600">{new Date(msg.timestamp).toLocaleTimeString()}:</span> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-grow border px-2 py-1"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-1 ml-2">Send</button>
      </div>
    </div>
  );
}

export default ChatRoom;
