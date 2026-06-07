export async function generateWeeklySummary(entries) {
    const recent = entries.slice(0, 7);
  
    const summary = recent.map(e =>
      `Date: ${new Date(e.date).toLocaleDateString()}, Emotion: ${e.primaryEmotion}, Energy: ${e.energyLevel}/10, Themes: ${e.themes.join(', ')}, Insight: "${e.keyInsight}"`
    ).join('\n');
  
    const response = await fetch('/api/weekly', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary })
    });
  
    if (!response.ok) throw new Error('Failed to generate summary');
  
    const data = await response.json();
    return data.text;
  }