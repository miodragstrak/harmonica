import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io();

export default function Person2() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Load initial messages
    fetch('/api/messages?user=person2')
      .then(res => res.json())
      .then(data => setMessages(data));

    // Setup socket listeners
    socket.on('new-message-person2', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('new-message-person2');
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const message = { text: input, sender: 'person2', timestamp: new Date() };
      socket.emit('send-message', { sender: 'person2', message });
      setInput('');
    }
  };

  return (
    <div className="container">
      <h1>Person 2 Chat</h1>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}