// import { useState } from 'react';
// import { getInsightStats } from '../utils/getInsightStats';
// import { generateWeeklySummary } from '../utils/generateWeeklySummary';

// const EMOTION_COLORS = {
//   joyful:    { dot: '#639922', dark_dot: '#7BAE7F' },
//   content:   { dot: '#1D9E75', dark_dot: '#6AAF88' },
//   anxious:   { dot: '#EF9F27', dark_dot: '#C4924A' },
//   stressed:  { dot: '#D85A30', dark_dot: '#C47A6A' },
//   sad:       { dot: '#378ADD', dark_dot: '#6A9AC4' },
//   angry:     { dot: '#E24B4A', dark_dot: '#C46A6A' },
//   neutral:   { dot: '#888780', dark_dot: '#8A8580' },
//   energetic: { dot: '#7F77DD', dark_dot: '#8A80C4' },
//   tired:     { dot: '#B4B2A9', dark_dot: '#7A7570' },
// };

// export function MoodMap({ entries, theme }) {
//   const [summary, setSummary] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [summaryError, setSummaryError] = useState(null);

//   const stats = getInsightStats(entries);
//   const isDark = theme === 'dark';

//   if (!stats || entries.length < 2) {
//     return (
//       <div style={{ textAlign: 'center', padding: '60px 0' }}>
//         <div style={{ fontSize: 32, marginBottom: 12 }}>◎</div>
//         <p style={{
//           fontFamily: 'var(--font-mono)', fontSize: 12,
//           color: 'var(--text-tertiary)', letterSpacing: '0.04em'
//         }}>
//           add at least 2 entries to see your mood map
//         </p>
//       </div>
//     );
//   }

//   async function handleGenerateSummary() {
//     setIsGenerating(true);
//     setSummaryError(null);
//     try {
//       const text = await generateWeeklySummary(entries);
//       setSummary(text);
//     } catch (e) {
//       setSummaryError('Could not generate summary. Try again.');
//     } finally {
//       setIsGenerating(false);
//     }
//   }

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

//       {/* Stats row */}
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
//         {[
//           { label: 'entries logged', value: stats.totalEntries },
//           { label: 'avg energy',     value: `${stats.avgEnergy}/10` },
//           { label: 'warnings',       value: stats.warningCount }
//         ].map(({ label, value }) => (
//           <div key={label} style={{
//             background: 'var(--bg-card)',
//             border: '1px solid var(--border)',
//             borderRadius: 14, padding: '16px',
//             boxShadow: 'var(--shadow-sm)'
//           }}>
//             <div style={{
//               fontFamily: 'var(--font-mono)', fontSize: 10,
//               color: 'var(--text-tertiary)', marginBottom: 8,
//               letterSpacing: '0.06em', textTransform: 'uppercase'
//             }}>
//               {label}
//             </div>
//             <div style={{
//               fontFamily: 'var(--font-mono)', fontSize: 24,
//               fontWeight: 500, color: 'var(--text-primary)'
//             }}>
//               {value}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Warning banner */}
//       {stats.warningCount > 0 && (
//         <div style={{
//           padding: '12px 16px',
//           background: 'var(--danger-bg)',
//           borderRadius: 12,
//           fontFamily: 'var(--font-mono)',
//           fontSize: 11, color: 'var(--danger)',
//           letterSpacing: '0.03em'
//         }}>
//           ⚠ {stats.warningCount} entr{stats.warningCount > 1 ? 'ies' : 'y'} flagged a warning sign — pay attention to your stress levels
//         </div>
//       )}

//       {/* Emotion distribution */}
//       <div>
//         <div style={{
//           fontFamily: 'var(--font-mono)', fontSize: 10,
//           fontWeight: 500, color: 'var(--text-tertiary)',
//           textTransform: 'uppercase', letterSpacing: '0.08em',
//           marginBottom: 16
//         }}>
//           Emotion distribution
//         </div>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//           {stats.sortedEmotions.map(([emotion, count]) => {
//             const ec = EMOTION_COLORS[emotion] || EMOTION_COLORS.neutral;
//             const dot = isDark ? ec.dark_dot : ec.dot;
//             const pct = Math.round((count / stats.totalEntries) * 100);
//             return (
//               <div key={emotion} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                 <div style={{
//                   width: 8, height: 8, borderRadius: '50%',
//                   background: dot, flexShrink: 0
//                 }} />
//                 <div style={{
//                   fontFamily: 'var(--font-mono)', fontSize: 12,
//                   color: 'var(--text-secondary)', minWidth: 76,
//                   letterSpacing: '0.02em'
//                 }}>
//                   {emotion}
//                 </div>
//                 <div style={{
//                   flex: 1, height: 4,
//                   background: 'var(--bg-hover)',
//                   borderRadius: 2, overflow: 'hidden'
//                 }}>
//                   <div style={{
//                     width: `${pct}%`, height: '100%',
//                     background: dot, borderRadius: 2,
//                     transition: 'width 0.8s ease'
//                   }} />
//                 </div>
//                 <div style={{
//                   fontFamily: 'var(--font-mono)', fontSize: 11,
//                   color: 'var(--text-tertiary)',
//                   minWidth: 32, textAlign: 'right'
//                 }}>
//                   {pct}%
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Recurring themes */}
//       <div>
//         <div style={{
//           fontFamily: 'var(--font-mono)', fontSize: 10,
//           fontWeight: 500, color: 'var(--text-tertiary)',
//           textTransform: 'uppercase', letterSpacing: '0.08em',
//           marginBottom: 12
//         }}>
//           Recurring themes
//         </div>
//         <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//           {stats.topThemes.map(t => (
//             <span key={t} style={{
//               fontFamily: 'var(--font-mono)',
//               fontSize: 10, padding: '4px 12px',
//               borderRadius: 20, letterSpacing: '0.04em',
//               background: 'var(--bg-hover)',
//               color: 'var(--text-secondary)',
//               border: '1px solid var(--border-light)'
//             }}>
//               {t}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Divider */}
//       <div style={{ height: 1, background: 'var(--border)' }} />

//       {/* Weekly summary */}
//       <div>
//         <button
//           onClick={handleGenerateSummary}
//           disabled={isGenerating}
//           style={{
//             width: '100%', padding: '14px',
//             borderRadius: 14,
//             border: '1px solid var(--border)',
//             background: isGenerating ? 'var(--bg-hover)' : 'var(--text-primary)',
//             color: isGenerating ? 'var(--text-tertiary)' : 'var(--bg)',
//             fontFamily: 'var(--font-mono)',
//             fontSize: 12, letterSpacing: '0.08em',
//             textTransform: 'uppercase',
//             cursor: isGenerating ? 'not-allowed' : 'pointer',
//             transition: 'all 0.2s'
//           }}
//         >
//           {isGenerating ? 'generating reflection...' : '✦ generate weekly ai reflection'}
//         </button>

//         {summaryError && (
//           <p style={{
//             fontFamily: 'var(--font-mono)', fontSize: 11,
//             color: 'var(--danger)', marginTop: 10,
//             letterSpacing: '0.02em'
//           }}>
//             {summaryError}
//           </p>
//         )}

//         {summary && (
//           <div style={{
//             marginTop: 16, padding: '20px',
//             background: 'var(--bg-card)',
//             border: '1px solid var(--border)',
//             borderLeft: '3px solid var(--accent)',
//             borderRadius: 14,
//             fontFamily: 'var(--font-display)',
//             fontSize: 14, color: 'var(--text-primary)',
//             lineHeight: 1.85, fontStyle: 'italic',
//             boxShadow: 'var(--shadow-sm)'
//           }}>
//             {summary}
//           </div>
//         )}
//       </div>

//     </div>
//   );
// }


import { useState, useEffect, useRef } from 'react';
import { getInsightStats } from '../utils/getInsightStats';
import { generateWeeklySummary } from '../utils/generateWeeklySummary';

const EMOTION_COLORS = {
  joyful:    { dot: '#639922', dark_dot: '#7BAE7F' },
  content:   { dot: '#1D9E75', dark_dot: '#6AAF88' },
  anxious:   { dot: '#EF9F27', dark_dot: '#C4924A' },
  stressed:  { dot: '#D85A30', dark_dot: '#C47A6A' },
  sad:       { dot: '#378ADD', dark_dot: '#6A9AC4' },
  angry:     { dot: '#E24B4A', dark_dot: '#C46A6A' },
  neutral:   { dot: '#888780', dark_dot: '#8A8580' },
  energetic: { dot: '#7F77DD', dark_dot: '#8A80C4' },
  tired:     { dot: '#B4B2A9', dark_dot: '#7A7570' },
};

/* ── Streak calculator ── */
function calcStreak(entries) {
  if (!entries.length) return { current: 0, longest: 0, totalDays: 0 };

  const days = [...new Set(
    entries.map(e => new Date(e.date).toDateString())
  )].map(d => new Date(d)).sort((a, b) => b - a);

  let current = 1;
  let longest = 1;
  let temp = 1;

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const lastDay = days[0].toDateString();

  // streak breaks if last entry wasn't today or yesterday
  if (lastDay !== today && lastDay !== yesterday) current = 0;
  else {
    for (let i = 1; i < days.length; i++) {
      const diff = (days[i - 1] - days[i]) / 86400000;
      if (diff === 1) { temp++; longest = Math.max(longest, temp); }
      else { temp = 1; }
    }
    current = temp;
  }

  return { current, longest, totalDays: days.length };
}

/* ── Energy chart ── */
function EnergyChart({ entries, isDark }) {
  const canvasRef = useRef(null);

  const chartData = [...entries]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-14); // last 14 entries

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || chartData.length < 2) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.clearRect(0, 0, W, H);

    const pad = { top: 16, right: 16, bottom: 32, left: 28 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;

    const accent = isDark ? '#7BAE7F' : '#2C5F2E';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#4A4640' : '#A8A39C';
    const dotColor = isDark ? '#7BAE7F' : '#2C5F2E';

    // grid lines at 2, 4, 6, 8, 10
    [2, 4, 6, 8, 10].forEach(v => {
      const y = pad.top + chartH - ((v / 10) * chartH);
      ctx.beginPath();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + chartW, y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = textColor;
      ctx.font = `10px 'DM Mono', monospace`;
      ctx.textAlign = 'right';
      ctx.fillText(v, pad.left - 6, y + 3);
    });

    // gradient fill
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad.addColorStop(0, isDark ? 'rgba(123,174,127,0.18)' : 'rgba(44,95,46,0.12)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    const points = chartData.map((e, i) => ({
      x: pad.left + (i / (chartData.length - 1)) * chartW,
      y: pad.top + chartH - ((e.energyLevel / 10) * chartH)
    }));

    // fill area
    ctx.beginPath();
    ctx.moveTo(points[0].x, pad.top + chartH);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, pad.top + chartH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // smooth line using bezier curves
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const cpx = (points[i - 1].x + points[i].x) / 2;
      ctx.bezierCurveTo(cpx, points[i - 1].y, cpx, points[i].y, points[i].x, points[i].y);
    }
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.stroke();

    // dots
    points.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
      ctx.strokeStyle = isDark ? '#17140F' : '#FDFAF4';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // x-axis date labels (show every 3rd)
    chartData.forEach((e, i) => {
      if (i % 3 !== 0 && i !== chartData.length - 1) return;
      const x = pad.left + (i / (chartData.length - 1)) * chartW;
      const label = new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      ctx.fillStyle = textColor;
      ctx.font = `10px 'DM Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(label, x, H - 6);
    });

  }, [chartData, isDark]);

  if (chartData.length < 2) {
    return (
      <div style={{
        textAlign: 'center', padding: '24px',
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'var(--text-tertiary)', letterSpacing: '0.04em'
      }}>
        add 2+ entries to see energy trend
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: 160, display: 'block' }}
    />
  );
}

/* ── Streak card ── */
function StreakCard({ entries }) {
  const { current, longest, totalDays } = calcStreak(entries);

  const flames = current >= 7 ? '🔥🔥🔥' : current >= 3 ? '🔥🔥' : current >= 1 ? '🔥' : '—';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
      {[
        { label: 'current streak', value: current, suffix: current === 1 ? 'day' : 'days', highlight: current > 0 },
        { label: 'longest streak', value: longest, suffix: longest === 1 ? 'day' : 'days', highlight: false },
        { label: 'days journaled', value: totalDays, suffix: 'total', highlight: false },
      ].map(({ label, value, suffix, highlight }) => (
        <div key={label} className="stat-card" style={{
          background: highlight ? 'var(--accent-bg)' : 'var(--bg-card)',
          border: `1px solid ${highlight ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 14, padding: '16px',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.2s'
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: highlight ? 'var(--accent)' : 'var(--text-tertiary)',
            marginBottom: 8, letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}>
            {label}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 26,
            fontWeight: 500,
            color: highlight ? 'var(--accent)' : 'var(--text-primary)',
            marginBottom: 2
          }}>
            {value}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--text-tertiary)', letterSpacing: '0.04em'
          }}>
            {suffix}
          </div>
        </div>
      ))}

      {/* Flame badge — full width if streak active */}
      {current > 0 && (
        <div style={{
          gridColumn: '1 / -1',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14, padding: '12px 16px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text-secondary)', letterSpacing: '0.04em'
          }}>
            {current >= 7
              ? `${current} days strong — you're on fire`
              : current >= 3
              ? `${current} day streak — keep it going`
              : `${current} day streak — great start`}
          </div>
          <div style={{ fontSize: 20 }}>{flames}</div>
        </div>
      )}
    </div>
  );
}

/* ── Main MoodMap ── */
export function MoodMap({ entries, theme }) {
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  const stats = getInsightStats(entries);
  const isDark = theme === 'dark';

  if (!stats || entries.length < 2) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>◎</div>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 12,
          color: 'var(--text-tertiary)', letterSpacing: '0.04em'
        }}>
          add at least 2 entries to see your mood map
        </p>
      </div>
    );
  }

  async function handleGenerateSummary() {
    setIsGenerating(true);
    setSummaryError(null);
    try {
      const text = await generateWeeklySummary(entries);
      setSummary(text);
    } catch (e) {
      setSummaryError('Could not generate summary. Try again.');
    } finally {
      setIsGenerating(false);
    }
  }

  const SectionLabel = ({ children }) => (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: 10,
      fontWeight: 500, color: 'var(--text-tertiary)',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      marginBottom: 14
    }}>
      {children}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Streak tracker ── */}
      <div>
        <SectionLabel>Journaling streak</SectionLabel>
        <StreakCard entries={entries} />
      </div>

      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* ── Energy trend ── */}
      <div>
        <SectionLabel>Energy over time</SectionLabel>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14, padding: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <EnergyChart entries={entries} isDark={isDark} />
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* ── Stats row ── */}
      <div>
        <SectionLabel>Overview</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { label: 'entries logged', value: stats.totalEntries },
            { label: 'avg energy',     value: `${stats.avgEnergy}/10` },
            { label: 'warnings',       value: stats.warningCount }
          ].map(({ label, value }) => (
            <div key={label} className="stat-card" style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14, padding: '16px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10,
                color: 'var(--text-tertiary)', marginBottom: 8,
                letterSpacing: '0.06em', textTransform: 'uppercase'
              }}>
                {label}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 24,
                fontWeight: 500, color: 'var(--text-primary)'
              }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Warning banner ── */}
      {stats.warningCount > 0 && (
        <div style={{
          padding: '12px 16px', background: 'var(--danger-bg)',
          borderRadius: 12, fontFamily: 'var(--font-mono)',
          fontSize: 11, color: 'var(--danger)', letterSpacing: '0.03em'
        }}>
          ⚠ {stats.warningCount} entr{stats.warningCount > 1 ? 'ies' : 'y'} flagged a warning sign — pay attention to your stress levels
        </div>
      )}

      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* ── Emotion distribution ── */}
      <div>
        <SectionLabel>Emotion distribution</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {stats.sortedEmotions.map(([emotion, count]) => {
            const ec = EMOTION_COLORS[emotion] || EMOTION_COLORS.neutral;
            const dot = isDark ? ec.dark_dot : ec.dot;
            const pct = Math.round((count / stats.totalEntries) * 100);
            return (
              <div key={emotion} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: dot, flexShrink: 0
                }} />
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  color: 'var(--text-secondary)', minWidth: 76,
                  letterSpacing: '0.02em'
                }}>
                  {emotion}
                </div>
                <div style={{
                  flex: 1, height: 4,
                  background: 'var(--bg-hover)',
                  borderRadius: 2, overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${pct}%`, height: '100%',
                    background: dot, borderRadius: 2,
                    transition: 'width 0.8s ease'
                  }} />
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: 'var(--text-tertiary)',
                  minWidth: 32, textAlign: 'right'
                }}>
                  {pct}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* ── Recurring themes ── */}
      <div>
        <SectionLabel>Recurring themes</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {stats.topThemes.map(t => (
            <span key={t} className="tag-pill" style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10, padding: '4px 12px',
              borderRadius: 20, letterSpacing: '0.04em',
              background: 'var(--bg-hover)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-light)'
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* ── Weekly summary ── */}
      <div>
        <SectionLabel>AI weekly reflection</SectionLabel>
        <button
          onClick={handleGenerateSummary}
          disabled={isGenerating}
          style={{
            width: '100%', padding: '14px',
            borderRadius: 14,
            border: '1px solid var(--border)',
            background: isGenerating ? 'var(--bg-hover)' : 'var(--text-primary)',
            color: isGenerating ? 'var(--text-tertiary)' : 'var(--bg)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12, letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
          }}
        >
          {isGenerating ? 'generating...' : '✦ generate weekly ai reflection'}
        </button>

        {summaryError && (
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--danger)', marginTop: 10, letterSpacing: '0.02em'
          }}>
            {summaryError}
          </p>
        )}

        {summary && (
          <div style={{
            marginTop: 16, padding: '20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderLeft: '3px solid var(--accent)',
            borderRadius: 14,
            fontFamily: 'var(--font-display)',
            fontSize: 14, color: 'var(--text-primary)',
            lineHeight: 1.85, fontStyle: 'italic',
            boxShadow: 'var(--shadow-sm)',
            animation: 'fadeUp 0.4s ease'
          }}>
            {summary}
          </div>
        )}
      </div>

    </div>
  );
}