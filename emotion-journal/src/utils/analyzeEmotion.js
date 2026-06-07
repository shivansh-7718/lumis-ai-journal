export async function analyzeEmotion(text) {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
  
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
  
    const data = await response.json();
  
    // handle both response formats
    if (data.primaryEmotion) return data;
  
    const raw = data.content
      ?.find(b => b.type === 'text')
      ?.text || '{}';
  
    const clean = raw.replace(/```json|```/g, '').trim();
  
    try {
      return JSON.parse(clean);
    } catch {
      throw new Error('Invalid JSON from server. Try again.');
    }
  }