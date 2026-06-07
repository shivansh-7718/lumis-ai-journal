export function createEntry(text, analysis) {
    return {
      id: crypto.randomUUID(),
      text,
      date: new Date().toISOString(),
      duration: null, // we'll fill this later
      primaryEmotion: analysis.primaryEmotion || 'neutral',
      energyLevel: analysis.energyLevel || 5,
      themes: analysis.themes || [],
      keyInsight: analysis.keyInsight || '',
      warningSign: analysis.warningSign || null
    };
  }