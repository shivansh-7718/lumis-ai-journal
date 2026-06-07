export function getInsightStats(entries) {
    if (!entries.length) return null;
  
    const emotionCounts = {};
    let totalEnergy = 0;
    const themeCounts = {};
    const warnings = entries.filter(e => e.warningSign);
  
    entries.forEach(e => {
      emotionCounts[e.primaryEmotion] = (emotionCounts[e.primaryEmotion] || 0) + 1;
      totalEnergy += e.energyLevel || 5;
      (e.themes || []).forEach(t => {
        themeCounts[t] = (themeCounts[t] || 0) + 1;
      });
    });
  
    const sortedEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1]);
  
    const topThemes = Object.entries(themeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([theme]) => theme);
  
    return {
      totalEntries: entries.length,
      avgEnergy: Math.round((totalEnergy / entries.length) * 10) / 10,
      sortedEmotions,
      topThemes,
      warningCount: warnings.length,
      dominantEmotion: sortedEmotions[0]?.[0] || 'neutral'
    };
  }