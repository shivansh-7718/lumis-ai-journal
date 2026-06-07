import { useState, useEffect } from 'react';
import { generateEmotionCard } from '../utils/generateCard';

export function ShareModal({ entry, theme, onClose }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [generating, setGenerating] = useState(true);

  useEffect(() => {
    // small delay so modal animation plays first
    const t = setTimeout(async () => {
      const url = await generateEmotionCard(entry, theme);
      setImageUrl(url);
      setGenerating(false);
    }, 300);
    return () => clearTimeout(t);
  }, [entry, theme]);

  function handleDownload() {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `lumis-${entry.primaryEmotion}-${Date.now()}.png`;
    a.click();
  }

  // close on backdrop click
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div onClick={handleBackdrop} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 24,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        width: '100%', maxWidth: 420,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 24, overflow: 'hidden',
        boxShadow: 'var(--shadow-lift)',
        animation: 'fadeUp 0.3s ease'
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)'
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 16, fontWeight: 600,
              color: 'var(--text-primary)', marginBottom: 2
            }}>
              Emotion card
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--text-tertiary)', letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              share your moment
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%',
            border: '1px solid var(--border)',
            background: 'var(--bg-hover)',
            color: 'var(--text-secondary)',
            cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>×</button>
        </div>

        {/* Card preview */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{
            width: '100%', aspectRatio: '1',
            borderRadius: 16, overflow: 'hidden',
            background: 'var(--bg-hover)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            border: '1px solid var(--border)'
          }}>
            {generating ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 20, height: 20,
                  border: '2px solid var(--border)',
                  borderTopColor: 'var(--accent)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: 'var(--text-tertiary)', letterSpacing: '0.04em'
                }}>
                  generating card...
                </span>
              </div>
            ) : (
              <img
                src={imageUrl} alt="Emotion card"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleDownload}
              disabled={generating}
              style={{
                flex: 1, padding: '13px',
                borderRadius: 12, border: '1px solid var(--border)',
                background: generating ? 'var(--bg-hover)' : 'var(--text-primary)',
                color: generating ? 'var(--text-tertiary)' : 'var(--bg)',
                fontFamily: 'var(--font-mono)', fontSize: 11,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                cursor: generating ? 'not-allowed' : 'pointer'
              }}
            >
              ↓ download png
            </button>

            {navigator.share && (
              <button
                onClick={() => navigator.share({
                  title: 'My Lumis emotion card',
                  text: `Feeling ${entry.primaryEmotion} today. ${entry.keyInsight}`,
                  url: window.location.href
                })}
                disabled={generating}
                style={{
                  flex: 1, padding: '13px',
                  borderRadius: 12, border: '1px solid var(--border)',
                  background: 'var(--bg-hover)',
                  color: generating ? 'var(--text-tertiary)' : 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  cursor: generating ? 'not-allowed' : 'pointer'
                }}
              >
                ↗ share
              </button>
            )}
          </div>

          <p style={{
            marginTop: 12, textAlign: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--text-tertiary)', letterSpacing: '0.04em'
          }}>
            1080×1080 · perfect for instagram stories
          </p>
        </div>
      </div>
    </div>
  );
}