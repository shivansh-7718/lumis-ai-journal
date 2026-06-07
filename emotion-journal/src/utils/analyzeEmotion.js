export async function analyzeEmotion(text) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
  
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
  
    const data = await response.json();
  
    // extract text from Claude's response
    const raw = data.content
      ?.find(b => b.type === 'text')
      ?.text || '{}';
  
    // strip any accidental markdown fences
    const clean = raw.replace(/```json|```/g, '').trim();
  
    try {
      return JSON.parse(clean);
    } catch {
      throw new Error('Claude returned invalid JSON. Try again.');
    }
  }