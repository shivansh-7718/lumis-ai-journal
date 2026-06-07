import { useState, useEffect } from 'react';

const EMOTIONS = [
  { word: 'joyful',      color: '#7BAE7F' },
  { word: 'overwhelmed', color: '#C47A6A' },
  { word: 'alive',       color: '#6AAF88' },
  { word: 'anxious',     color: '#C4924A' },
  { word: 'grateful',    color: '#7BAE7F' },
  { word: 'exhausted',   color: '#7A7570' },
  { word: 'hopeful',     color: '#6A9AC4' },
];

const FEATURES = [
  {
    icon: '🎙',
    title: 'Speak, don\'t type',
    desc: 'Just talk. Lumis transcribes your voice in real time — no keyboard, no friction, no filter.'
  },
  {
    icon: '🧠',
    title: 'AI reads between the lines',
    desc: 'Not just what you said — but how you felt. Energy levels, recurring themes, warning signs.'
  },
  {
    icon: '📊',
    title: 'Your emotions, mapped',
    desc: 'A mood map that shows patterns across weeks. See yourself more clearly than ever before.'
  },
  {
    icon: '✦',
    title: 'Share your moments',
    desc: 'Generate beautiful emotion cards from any entry. Your inner world, made visual.'
  },
];

const STEPS = [
  { num: '01', title: 'Record', desc: 'Tap the mic. Speak freely for 30 seconds or 30 minutes. No rules.' },
  { num: '02', title: 'Analyse', desc: 'AI detects your emotion, energy, themes — and what\'s really going on beneath the surface.' },
  { num: '03', title: 'Understand', desc: 'Over time, patterns emerge. Lumis shows you who you\'ve been — and who you\'re becoming.' },
];

function TypewriterEmotion() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState('typing'); // typing | pause | erasing

  useEffect(() => {
    const target = EMOTIONS[index].word;
    let timeout;

    if (phase === 'typing') {
      if (displayed.length < target.length) {
        timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setPhase('pause'), 1800);
      }
    } else if (phase === 'pause') {
      timeout = setTimeout(() => setPhase('erasing'), 400);
    } else if (phase === 'erasing') {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      } else {
        setIndex(i => (i + 1) % EMOTIONS.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, phase, index]);

  return (
    <span style={{
      color: EMOTIONS[index].color,
      transition: 'color 0.4s ease',
      display: 'inline-block',
      minWidth: 20
    }}>
      {displayed}
      <span style={{
        display: 'inline-block', width: 3, height: '0.85em',
        background: EMOTIONS[index].color, marginLeft: 3,
        verticalAlign: 'middle',
        animation: 'blink 1s step-end infinite',
        opacity: phase === 'pause' ? 1 : 1
      }} />
    </span>
  );
}

export function LandingPage({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '20px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(15,13,11,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 22,
          fontWeight: 600, letterSpacing: '-0.02em',
          color: 'var(--text-primary)'
        }}>
          Lumis
        </div>
        <button onClick={onGetStarted} style={{
          padding: '9px 22px', borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(255,255,255,0.08)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)', fontSize: 11,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          cursor: 'pointer', transition: 'all 0.2s'
        }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          get started
        </button>
      </nav>

      {/* ── Hero ── */}
      <section  className="landing-section" style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 80px',
        textAlign: 'center', position: 'relative'
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-block',
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--accent)', background: 'var(--accent-bg)',
          border: '1px solid var(--accent)',
          padding: '5px 14px', borderRadius: 20, marginBottom: 40,
          animation: 'fadeUp 0.6s ease both'
        }}>
          AI-powered emotion journal
        </div>

        {/* Main headline */}
        <h1 style={{
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontWeight: 600, lineHeight: 1.05,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          marginBottom: 24, maxWidth: 900,
          animation: 'fadeUp 0.6s ease 0.1s both'
        }}>
          today I felt
          <br />
          <TypewriterEmotion />
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: 18, lineHeight: 1.7,
          color: 'var(--text-secondary)',
          maxWidth: 520, marginBottom: 48,
          animation: 'fadeUp 0.6s ease 0.2s both'
        }}>
          Lumis listens to your voice, reads your emotions, and maps your inner world over time — so you finally understand yourself.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: 12, flexWrap: 'wrap',
          justifyContent: 'center',
          animation: 'fadeUp 0.6s ease 0.3s both'
        }}>
          <button onClick={onGetStarted} style={{
            padding: '16px 36px', borderRadius: 14,
            border: 'none', background: 'var(--text-primary)',
            color: 'var(--bg)',
            fontFamily: 'var(--font-mono)', fontSize: 13,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)'
          }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            start journaling free
          </button>
          <button onClick={() => document.getElementById('how').scrollIntoView({ behavior: 'smooth' })}
            style={{
              padding: '16px 36px', borderRadius: 14,
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)', fontSize: 13,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = 'var(--text-tertiary)'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            see how it works
          </button>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 40,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 8,
          animation: 'fadeUp 0.6s ease 0.6s both'
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--text-tertiary)', letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>scroll</div>
          <div style={{
            width: 1, height: 40,
            background: 'linear-gradient(to bottom, var(--text-tertiary), transparent)'
          }} />
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how"  className="landing-section" style={{
        padding: '120px 24px',
        maxWidth: 800, margin: '0 auto'
      }}>
        <div style={{ marginBottom: 72, textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--text-tertiary)', letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: 16
          }}>
            how it works
          </div>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 600, letterSpacing: '-0.02em',
            color: 'var(--text-primary)', lineHeight: 1.1
          }}>
            three steps to<br />know yourself better
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {STEPS.map((step, i) => (
            <div key={step.num} style={{
              display: 'flex', gap: 40, alignItems: 'flex-start',
              padding: '40px 0',
              borderBottom: i < STEPS.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 13,
                color: 'var(--accent)', letterSpacing: '0.04em',
                minWidth: 36, paddingTop: 4
              }}>
                {step.num}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: 28, fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)', marginBottom: 12
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: 16, lineHeight: 1.7,
                  color: 'var(--text-secondary)'
                }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section  className="landing-section" style={{
        padding: '120px 24px',
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ marginBottom: 64, textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--text-tertiary)', letterSpacing: '0.1em',
              textTransform: 'uppercase', marginBottom: 16
            }}>
              what lumis does
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 600, letterSpacing: '-0.02em',
              color: 'var(--text-primary)', lineHeight: 1.1
            }}>
              your journal,<br />finally intelligent
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16
          }}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className="card-hover" style={{
                padding: '28px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 18,
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ fontSize: 28, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{
                  fontSize: 18, fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'var(--text-primary)', marginBottom: 10
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontSize: 14, lineHeight: 1.7,
                  color: 'var(--text-secondary)'
                }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Emotional quote ── */}
      <section  className="landing-section" style={{
        padding: '140px 24px',
        textAlign: 'center',
        maxWidth: 700, margin: '0 auto'
      }}>
        <div style={{
          fontSize: 'clamp(22px, 4vw, 38px)',
          fontWeight: 500, lineHeight: 1.5,
          letterSpacing: '-0.01em',
          color: 'var(--text-primary)',
          fontStyle: 'italic', marginBottom: 24
        }}>
          "Most people don't know what they feel. They just live inside it. Lumis helps you step outside — and finally see yourself."
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--text-tertiary)', letterSpacing: '0.06em',
          textTransform: 'uppercase'
        }}>
          the journal that listens back
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section  className="landing-section" style={{
        padding: '120px 24px',
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-card)'
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 600, letterSpacing: '-0.03em',
            color: 'var(--text-primary)', lineHeight: 1.05,
            marginBottom: 24
          }}>
            ready to understand yourself?
          </h2>
          <p style={{
            fontSize: 16, lineHeight: 1.7,
            color: 'var(--text-secondary)', marginBottom: 40
          }}>
            Free to start. No credit card. Just your voice and a few minutes a day.
          </p>
          <button onClick={onGetStarted} style={{
            padding: '18px 48px', borderRadius: 16,
            border: 'none', background: 'var(--text-primary)',
            color: 'var(--bg)',
            fontFamily: 'var(--font-mono)', fontSize: 13,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: 'var(--shadow-md)'
          }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lift)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
          >
            start for free →
          </button>

          <div style={{
            marginTop: 24, fontFamily: 'var(--font-mono)',
            fontSize: 11, color: 'var(--text-tertiary)',
            letterSpacing: '0.04em'
          }}>
            your journal is private · encrypted · always yours
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer  className="landing-section" style={{
        padding: '32px 40px',
        borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 16,
          fontWeight: 600, color: 'var(--text-primary)'
        }}>
          Lumis
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--text-tertiary)', letterSpacing: '0.06em'
        }}>
          speak. feel. understand. · {new Date().getFullYear()}
        </div>
      </footer>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}