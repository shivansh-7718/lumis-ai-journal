export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
  
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
              content: `Analyze this journal entry for emotional signals. Respond ONLY with a JSON object.
  
  Journal entry: "${text}"
  
  Return exactly:
  {
    "primaryEmotion": one of [joyful, content, anxious, stressed, sad, angry, neutral, energetic, tired],
    "energyLevel": number between 1 and 10,
    "themes": array of 3 to 5 short strings,
    "keyInsight": one sentence,
    "warningSign": null or short string if burnout or distress detected
  }`
            }
          ]
        })
      });
  
      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content || '{}';
      const clean = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      res.json({ content: [{ type: 'text', text: JSON.stringify(parsed) }] });
  
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }