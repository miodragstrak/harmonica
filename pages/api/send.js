import { Server } from 'socket.io';

let io;
const messages = { person1: [], person2: [] };

export default function handler(req, res) {
  if (!io) {
    io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      socket.on('send-message', (data) => {
        const { sender, message } = data;
        if (sender === 'person1') {
          messages.person2.push(message);
          io.emit('new-message-person2', message);
        } else if (sender === 'person2') {
          messages.person1.push(message);
          io.emit('new-message-person1', message);
        }
      });
    });
  }
  res.end();
}