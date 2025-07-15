import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import styles from '../styles/globals.css';

const socket = io();

export default function Person1() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatPhase, setChatPhase] = useState('ai');

  useEffect(() => {
    fetch('/api/messages?user=person1')
      .then(res => res.json())
      .then(data => setMessages(data));

    socket.on('new-message-person1', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('chat-phase-changed', (phase) => {
      setChatPhase(phase);
    });

    return () => {
      socket.off('new-message-person1');
      socket.off('chat-phase-changed');
    };
  }, []);

// Add this function to your Person1 component
const sendMessage = () => {
  if (input.trim()) {
    const message = { text: input, sender: 'person1', timestamp: new Date() };
    
    if (chatPhase === 'ai') {
      // Send to n8n webhook
      fetch('https://your-n8n-instance.com/webhook-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      });
    }
    
    socket.emit('send-message', { sender: 'person1', message });
    setInput('');
  }
};

  return (
    <div className="container">
      <h1>Person 1 Chat</h1>
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
      <div className="status">
        Current mode: {chatPhase === 'ai' ? 'Chatting with AI' : 'Chatting with Person 2'}
      </div>
    </div>
  );
}