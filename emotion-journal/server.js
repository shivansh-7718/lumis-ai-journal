import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: 'You are an emotion analysis assistant. Always respond with valid JSON only. No markdown, no explanation, no extra text.'
          },
          {
            role: 'user',
            content: buildPrompt(text)
          }
        ]
      })
    });

    const data = await response.json();
    console.log('Groq response:', JSON.stringify(data, null, 2));

    const raw = data.choices?.[0]?.message?.content || '{}';
    const clean = raw.replace(/```json|```/g, '').trim();

    try {
      const parsed = JSON.parse(clean);
      res.json({ content: [{ type: 'text', text: JSON.stringify(parsed) }] });
    } catch {
      res.status(500).json({ error: 'Invalid JSON from Groq' });
    }

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

function buildPrompt(text) {
  return `Analyze this journal entry for emotional signals. Respond ONLY with a JSON object, no markdown, no preamble, no extra text.

Journal entry: "${text}"

Return exactly this structure:
{
  "primaryEmotion": one of [joyful, content, anxious, stressed, sad, angry, neutral, energetic, tired],
  "energyLevel": number between 1 and 10,
  "themes": array of 3 to 5 short strings like "work pressure" or "self-doubt",
  "keyInsight": one sentence about what stands out emotionally,
  "warningSign": null or a short string if burnout or distress is detected
}`;
}

app.post('/api/weekly', async (req, res) => {
    const { summary } = req.body;
  
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 1000,
          messages: [
            {
              role: 'system',
              content: 'You are a warm, empathetic journaling coach. Write like a thoughtful friend, not a therapist. Be specific, personal, and concise.'
            },
            {
              role: 'user',
              content: `Based on these journal emotion summaries from the past week, write a 3-4 sentence personal reflection. Be specific about patterns you notice. Point out one thing going well and one thing worth watching.\n\n${summary}`
            }
          ]
        })
      });
  
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      res.json({ text });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

app.listen(3001, () => console.log('Proxy running on http://localhost:3001'));