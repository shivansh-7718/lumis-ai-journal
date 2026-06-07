export async function generateEmotionCard(entry, theme) {
    const canvas = document.createElement('canvas');
    const W = 1080;
    const H = 1080;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
  
    const isDark = theme === 'dark';
  
    // Emotion color palettes
    const PALETTES = {
      joyful:    { bg1: '#2C5F2E', bg2: '#1A3A1A', accent: '#A8D5A2', text: '#E8F5E8' },
      content:   { bg1: '#1E5C3A', bg2: '#0F3020', accent: '#A0D4B8', text: '#E8F5EE' },
      anxious:   { bg1: '#7A4A0A', bg2: '#4A2C04', accent: '#F5C87A', text: '#FDF5E8' },
      stressed:  { bg1: '#7A2E1A', bg2: '#4A1A0A', accent: '#F5A08A', text: '#FDF0EC' },
      sad:       { bg1: '#1A3F6B', bg2: '#0A2040', accent: '#90B8E0', text: '#EAF0F8' },
      angry:     { bg1: '#7A1A1A', bg2: '#4A0A0A', accent: '#F59090', text: '#FDF0F0' },
      neutral:   { bg1: '#3A3530', bg2: '#201C18', accent: '#C8C0B8', text: '#F5F0EB' },
      energetic: { bg1: '#3A2A7A', bg2: '#1E1548', accent: '#A898E8', text: '#F0EEFF' },
      tired:     { bg1: '#3A3530', bg2: '#201C18', accent: '#B8B0A8', text: '#F0EBE5' },
    };
  
    const pal = PALETTES[entry.primaryEmotion] || PALETTES.neutral;
  
    // ── Background gradient
    const grad = ctx.createLinearGradient(0, 0, W * 0.6, H);
    grad.addColorStop(0, pal.bg1);
    grad.addColorStop(1, pal.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  
    // ── Decorative circle top right
    ctx.beginPath();
    ctx.arc(W + 100, -100, 520, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.fill();
  
    // ── Decorative circle bottom left
    ctx.beginPath();
    ctx.arc(-80, H + 80, 400, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.fill();
  
    // ── Grain texture overlay
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const alpha = Math.random() * 0.06;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(x, y, 1, 1);
    }
  
    // ── Emotion badge
    const badgeX = 72;
    const badgeY = 72;
    ctx.beginPath();
    roundRect(ctx, badgeX, badgeY, 200, 48, 24);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fill();
  
    ctx.font = '500 20px "DM Mono", monospace';
    ctx.fillStyle = pal.accent;
    ctx.letterSpacing = '3px';
    ctx.fillText(entry.primaryEmotion.toUpperCase(), badgeX + 24, badgeY + 30);
  
    // ── Energy dot row
    const dotY = 160;
    const dotStartX = 72;
    ctx.font = '300 18px "DM Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.letterSpacing = '2px';
    ctx.fillText('ENERGY', dotStartX, dotY);
  
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.arc(dotStartX + 120 + i * 32, dotY - 6, 8, 0, Math.PI * 2);
      ctx.fillStyle = i < entry.energyLevel
        ? pal.accent
        : 'rgba(255,255,255,0.15)';
      ctx.fill();
    }
  
    // ── Divider line
    ctx.beginPath();
    ctx.moveTo(72, 200);
    ctx.lineTo(W - 72, 200);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
  
    // ── Key insight (main text)
    ctx.letterSpacing = '0px';
    const insight = `"${entry.keyInsight}"`;
    wrapText(ctx, insight, 72, 300, W - 144, 68, pal.text, '500 52px "Lora", serif');
  
    // ── Entry text preview
    const preview = entry.text.length > 120 ? entry.text.slice(0, 120) + '…' : entry.text;
    wrapText(ctx, preview, 72, 620, W - 144, 40, 'rgba(255,255,255,0.5)', '300 32px "Lora", serif');
  
    // ── Themes
    let themeX = 72;
    const themeY = 820;
    entry.themes?.slice(0, 4).forEach(t => {
      ctx.font = '400 20px "DM Mono", monospace';
      const tw = ctx.measureText(t).width + 40;
      ctx.beginPath();
      roundRect(ctx, themeX, themeY - 24, tw, 36, 18);
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.letterSpacing = '1px';
      ctx.fillText(t, themeX + 20, themeY);
      themeX += tw + 12;
    });
  
    // ── Bottom divider
    ctx.beginPath();
    ctx.moveTo(72, H - 140);
    ctx.lineTo(W - 72, H - 140);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
  
    // ── Lumis branding
    ctx.font = '600 36px "Lora", serif';
    ctx.fillStyle = pal.accent;
    ctx.letterSpacing = '-0.5px';
    ctx.fillText('Lumis', 72, H - 80);
  
    ctx.font = '300 20px "DM Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.letterSpacing = '2px';
    ctx.fillText('SPEAK. FEEL. UNDERSTAND.', 72, H - 48);
  
    // ── Date top right
    const date = new Date(entry.date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    ctx.font = '300 22px "DM Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.letterSpacing = '1px';
    ctx.textAlign = 'right';
    ctx.fillText(date, W - 72, H - 80);
    ctx.textAlign = 'left';
  
    return canvas.toDataURL('image/png');
  }
  
  // ── Helpers
  function wrapText(ctx, text, x, y, maxW, lineH, color, font) {
    ctx.font = font;
    ctx.fillStyle = color;
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    for (let i = 0; i < words.length; i++) {
      const test = line + words[i] + ' ';
      if (ctx.measureText(test).width > maxW && i > 0) {
        ctx.fillText(line, x, currentY);
        line = words[i] + ' ';
        currentY += lineH;
        if (currentY > y + lineH * 3) { // max 4 lines
          ctx.fillText(line + '…', x, currentY);
          return;
        }
      } else {
        line = test;
      }
    }
    ctx.fillText(line, x, currentY);
  }
  
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }