import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from ./public
app.use(express.static(path.join('public')));

// Parse JSON bodies (for future /query endpoint)
app.use(express.json());

// Simple health / placeholder route
app.get('/', (req, res) => {
  res.sendFile(path.join('public', 'index.html'));
});

// Placeholder POST /query route – will be expanded later
app.post('/query', (req, res) => {
  // TODO: integrate AI layer here
  res.json({ reply: 'Hello! This is where the AI reply will appear.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Karigar server listening at http://localhost:${PORT}`);
});