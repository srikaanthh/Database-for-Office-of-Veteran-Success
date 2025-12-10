const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json({ limit: '1mb' }));

/**
 * Chat endpoint:
 * - Accepts { query }
 * - Forwards to local Ollama LLM to interpret intent and optionally return a tool_call
 * - If tool_call returned, execute corresponding backend handler
 */
app.post('/api/chat', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Missing query' });

  try {
    // Forward query to Ollama
    const ollamaReq = {
      model: 'llama3', // Change model as needed
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant that returns either a plain chat reply or a JSON tool_call object describing a database action. If action is required, respond ONLY with a JSON object under the key "tool_call" like: {"tool_call":{"name":"queryTutors","args":{"subject":"math","day":"Wednesday"}}}. Otherwise return {"reply":"<text>"}',
        },
        { role: 'user', content: query },
      ],
    };

    const ollamaResp = await fetch('http://localhost:11434/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ollamaReq),
    });

    if (!ollamaResp.ok) {
      const text = await ollamaResp.text();
      console.error('Ollama error:', text);
      return res.status(502).json({ error: 'LLM error' });
    }

    const ollamaData = await ollamaResp.json();
    const assistantMsg = (ollamaData.choices && ollamaData.choices[0] && ollamaData.choices[0].message && ollamaData.choices[0].message.content) || '';

    // Try to parse JSON from assistantMsg
    let parsed = null;
    try {
      parsed = JSON.parse(assistantMsg);
    } catch (e) {
      // Not JSON: treat as plain reply
      return res.json({ reply: assistantMsg });
    }

    // If parsed.tool_call exists, execute corresponding backend handler
    if (parsed && parsed.tool_call && parsed.tool_call.name) {
      const tool = parsed.tool_call;
      const result = await executeTool(tool.name, tool.args || {});
      const replyText = formatResultToReply(tool.name, tool.args || {}, result);
      return res.json({ reply: replyText, data: result });
    } else if (parsed && parsed.reply) {
      return res.json({ reply: parsed.reply });
    } else {
      return res.json({ reply: 'I could not interpret the request.' });
    }
  } catch (err) {
    console.error('Chat handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Execute named backend tools -- extend with your query logic.
 */
async function executeTool(name, args) {
  if (name === 'queryTutors') {
    // Example: Query tutors based on args
    return { items: [{ name: 'John Doe', subject: 'Math', day: 'Wednesday' }] };
  }
  throw new Error('Unknown tool: ' + name);
}

function formatResultToReply(toolName, args, result) {
  if (toolName === 'queryTutors') {
    const items = (result && result.items) || [];
    if (!items.length) return 'No tutors found matching your criteria.';
    const names = items.map((t) => t.name).join(', ');
    return `Found tutors: ${names}.`;
  }
  return 'Tool executed.';
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));