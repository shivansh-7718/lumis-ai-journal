export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
  
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
              content: `Based on these journal emotion summaries, write a 3-4 sentence personal reflection. Be specific about patterns. Point out one thing going well and one worth watching.\n\n${summary}`
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
  }