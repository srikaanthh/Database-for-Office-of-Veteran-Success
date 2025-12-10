const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = 5001; // You can change this port if needed
const OLLAMA_URL = 'http://localhost:11434/v1/chat/completions';

app.use(cors());
app.use(bodyParser.json());

app.post('/api/ollama-chat', async (req, res) => {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Ollama proxy server running on http://localhost:${PORT}`);
});
