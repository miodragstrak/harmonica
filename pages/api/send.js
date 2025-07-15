import { Server } from 'socket.io';

let io;
const messages = { person1: [], person2: [] };
let chatPhase = 'ai'; // 'ai' or 'person2'

export default function handler(req, res) {
  if (!io) {
    io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      // Handle joining person2
      socket.on('person2-join', () => {
        chatPhase = 'person2';
        io.emit('chat-phase-changed', chatPhase);
      });

      // Handle messages
      socket.on('send-message', (data) => {
        const { sender, message } = data;
        
        if (sender === 'person1') {
          if (chatPhase === 'ai') {
            // In AI phase, just store for person1 (AI will respond via webhook)
            messages.person1.push(message);
          } else {
            // In person2 phase, send to person2
            messages.person2.push(message);
            io.emit('new-message-person2', message);
          }
        } 
        else if (sender === 'person2') {
          messages.person1.push(message);
          io.emit('new-message-person1', message);
        }
        else if (sender === 'ai') {
          messages.person1.push(message);
          io.emit('new-message-person1', message);
        }
      });
    });
  }
  res.end();
}