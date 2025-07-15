const messages = { person1: [], person2: [] };

export default function handler(req, res) {
  const { user } = req.query;
  
  if (user === 'person1') {
    res.status(200).json(messages.person1);
  } else if (user === 'person2') {
    res.status(200).json(messages.person2);
  } else {
    res.status(400).json({ error: 'Invalid user' });
  }
}