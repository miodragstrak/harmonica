import { Server } from 'socket.io';

let io;

export default function handler(req, res) {
  if (req.method === 'POST') {
    if (!io) {
      io = new Server(res.socket.server);
      res.socket.server.io = io;
    }

    const { message } = req.body;
    const aiMessage = { 
      text: message, 
      sender: 'ai', 
      timestamp: new Date() 
    };

    io.emit('new-message-person1', aiMessage);
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}