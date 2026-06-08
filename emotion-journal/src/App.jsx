import { useState, useEffect } from 'react';
import { Recorder } from './components/Recorder';
import { useJournal } from './hooks/useJournal';
import { useAuth } from './hooks/useAuth';
import { MoodMap } from './components/MoodMap';
import { AuthScreen } from './components/AuthScreen';
import { ShareModal } from './components/ShareModal';
import { LandingPage } from './components/LandingPage';

const EMOTION_COLORS = {
  joyful:    { bg: '#EAF3DE', text: '#2C5F2E', dark_bg: '#1A2B1A', dark_text: '#7BAE7F' },
  content:   { bg: '#E1F0E8', text: '#1E5C3A', dark_bg: '#152A20', dark_text: '#6AAF88' },
  anxious:   { bg: '#F5EDD8', text: '#7A4A0A', dark_bg: '#2A2010', dark_text: '#C4924A' },
  stressed:  { bg: '#F5E8E3', text: '#7A2E1A', dark_bg: '#2A1510', dark_text: '#C47A6A' },
  sad:       { bg: '#E3EDF5', text: '#1A3F6B', dark_bg: '#101C2A', dark_text: '#6A9AC4' },
  angry:     { bg: '#F5E3E3', text: '#7A1A1A', dark_bg: '#2A1010', dark_text: '#C46A6A' },
  neutral:   { bg: '#EDEBE5', text: '#4A4540', dark_bg: '#222018', dark_text: '#8A8580' },
  energetic: { bg: '#EAE8F5', text: '#3A2A7A', dark_bg: '#1A1528', dark_text: '#8A80C4' },
  tired:     { bg: '#EDEBE5', text: '#3A3530', dark_bg: '#1E1C18', dark_text: '#7A7570' },
};

const TABS = ['record', 'entries', 'insights'];

export default function App() {
  const { user, authError, authLoading, loginWithEmail, signupWithEmail, loginWithGoogle, logout } = useAuth();
  const { entries, isAnalyzing, error, addEntry, deleteEntry } = useJournal(user?.uid);
  const [tab, setTab] = useState('record');
  const [theme, setTheme] = useState(() => localStorage.getItem('journal_theme') || 'light');
  const [sharingEntry, setSharingEntry] = useState(null);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('journal_theme', theme);
  }, [theme]);

  async function handleEntryReady(text) {
    const entry = await addEntry(text);
    if (entry) setTab('entries');
  }

  // Loading state
  if (user === undefined) {
    return (
      <>
        <div className="bg-canvas">
          <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
        </div>
        <div style={{
          minHeight: '100vh', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 12,
          color: 'var(--text-tertiary)', letterSpacing: '0.06em'
        }}>
          <div style={{
            width: 16, height: 16, border: '1.5px solid var(--border)',
            borderTopColor: 'var(--text-secondary)', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', marginRight: 12
          }} />
          loading...
        </div>
      </>
    );
  }

  // Not logged in
  if (user === null) {
    return (
      <>
        <div className="bg-canvas">
          <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
        </div>
        {showLanding ? (
          <LandingPage onGetStarted={() => setShowLanding(false)} />
        ) : (
          <AuthScreen
            onLogin={loginWithEmail}
            onSignup={signupWithEmail}
            onGoogle={loginWithGoogle}
            error={authError}
            loading={authLoading}
            onBack={() => setShowLanding(true)}
          />
        )}
      </>
    );
  }

  // Logged in
  return (
    <>
      <div className="bg-canvas">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Header */}
        <div className="header-enter" style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', marginBottom: 40
        }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28, fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)', marginBottom: 4
            }}>
              Lumis
            </h1>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: 'var(--text-tertiary)',
              letterSpacing: '0.04em', textTransform: 'uppercase'
            }}>
              speak. feel. understand.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* User avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--accent-bg)',
              border: '1px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: 'var(--accent)', fontWeight: 500
            }}>
              {(user.displayName || user.email || 'U')[0].toUpperCase()}
            </div>

            {/* Theme toggle */}
            <button className="theme-btn"
              onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                border: '1px solid var(--border)', background: 'var(--bg-card)',
                cursor: 'pointer', fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)'
              }}>
              {theme === 'light' ? '◐' : '○'}
            </button>

            {/* Logout */}
            <button onClick={logout} style={{
              padding: '6px 12px', borderRadius: 8,
              border: '1px solid var(--border)', background: 'var(--bg-card)',
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--text-tertiary)', cursor: 'pointer',
              letterSpacing: '0.04em'
            }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--danger)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
            >
              sign out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-enter" style={{
          display: 'flex', marginBottom: 32,
          borderBottom: '1px solid var(--border)'
        }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 20px', border: 'none', background: 'none',
              fontFamily: 'var(--font-mono)', fontSize: 12,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: 'pointer',
              color: tab === t ? 'var(--text-primary)' : 'var(--text-tertiary)',
              fontWeight: tab === t ? 500 : 400,
              borderBottom: tab === t ? '2px solid var(--text-primary)' : '2px solid transparent',
              marginBottom: -1, transition: 'color 0.2s ease'
            }}>
              {t}
              {t === 'entries' && entries.length > 0 && (
                <span style={{
                  marginLeft: 6, fontSize: 10, background: 'var(--border)',
                  borderRadius: 8, padding: '1px 5px', color: 'var(--text-secondary)'
                }}>{entries.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Record Tab */}
        {tab === 'record' && (
          <div className="content-enter">
            <Recorder onEntryReady={handleEntryReady} disabled={isAnalyzing} />
            {isAnalyzing && (
              <div style={{
                marginTop: 20, display: 'flex', alignItems: 'center',
                gap: 10, fontFamily: 'var(--font-mono)',
                fontSize: 12, color: 'var(--text-tertiary)', letterSpacing: '0.04em',
                animation: 'fadeIn 0.3s ease'
              }}>
                <div style={{
                  width: 14, height: 14, border: '1.5px solid var(--border)',
                  borderTopColor: 'var(--text-secondary)', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                analysing emotions...
              </div>
            )}
            {error && (
              <div style={{
                marginTop: 16, padding: '12px 16px',
                background: 'var(--danger-bg)', borderRadius: 10,
                fontFamily: 'var(--font-mono)', fontSize: 12,
                color: 'var(--danger)', letterSpacing: '0.02em',
                animation: 'slideIn 0.3s ease'
              }}>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Entries Tab */}
        {tab === 'entries' && (
          <div className="content-enter" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {entries.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>◎</div>
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  color: 'var(--text-tertiary)', letterSpacing: '0.04em'
                }}>
                  no entries yet — record your first
                </p>
              </div>
            )}
            {entries.map((entry, i) => {
              const ec = EMOTION_COLORS[entry.primaryEmotion] || EMOTION_COLORS.neutral;
              const date = new Date(entry.date);
              const isDark = theme === 'dark';
              return (
                <div key={entry.id} className="card-hover" style={{
                  border: '1px solid var(--border)', borderRadius: 16,
                  padding: '20px 22px', background: 'var(--bg-card)',
                  boxShadow: 'var(--shadow-sm)',
                  animation: `fadeUp 0.4s ease ${i * 0.06}s both`
                }}>

                  {/* Entry header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
                      padding: '3px 10px', borderRadius: 20,
                      background: isDark ? ec.dark_bg : ec.bg,
                      color: isDark ? ec.dark_text : ec.text,
                      letterSpacing: '0.06em', textTransform: 'uppercase'
                    }}>
                      {entry.primaryEmotion}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11,
                      color: 'var(--text-tertiary)', letterSpacing: '0.02em'
                    }}>
                      {date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {' · '}
                      {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span style={{
                      marginLeft: 'auto', fontFamily: 'var(--font-mono)',
                      fontSize: 11, color: 'var(--text-tertiary)'
                    }}>
                      ⚡ {entry.energyLevel}/10
                    </span>
                  </div>

                  {/* Entry text */}
                  <p style={{
                    fontFamily: 'var(--font-display)', fontSize: 14,
                    lineHeight: 1.75, color: 'var(--text-secondary)',
                    marginBottom: 12, fontStyle: 'italic'
                  }}>
                    "{entry.text.length > 220 ? entry.text.slice(0, 220) + '…' : entry.text}"
                  </p>

                  {/* Key insight */}
                  <p style={{
                    fontFamily: 'var(--font-display)', fontSize: 13,
                    lineHeight: 1.65, color: 'var(--text-primary)',
                    marginBottom: 14, paddingLeft: 12,
                    borderLeft: '2px solid var(--accent)'
                  }}>
                    {entry.keyInsight}
                  </p>

                  {/* Warning */}
                  {entry.warningSign && (
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11,
                      padding: '8px 12px', background: 'var(--danger-bg)',
                      color: 'var(--danger)', borderRadius: 8, marginBottom: 12,
                      animation: 'slideIn 0.3s ease'
                    }}>
                      ⚠ {entry.warningSign}
                    </div>
                  )}

                  {/* Themes */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                    {entry.themes.map(t => (
                      <span key={t} className="tag-pill" style={{
                        fontFamily: 'var(--font-mono)', fontSize: 10,
                        padding: '3px 9px', borderRadius: 20,
                        background: 'var(--bg-hover)', color: 'var(--text-tertiary)',
                        border: '1px solid var(--border-light)', letterSpacing: '0.04em'
                      }}>{t}</span>
                    ))}
                  </div>

                  {/* Share + Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button
                      onClick={() => setSharingEntry(entry)}
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: 10,
                        color: 'var(--accent)', background: 'none',
                        border: 'none', cursor: 'pointer', padding: 0,
                        letterSpacing: '0.04em', transition: 'opacity 0.15s'
                      }}
                      onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
                      onMouseOut={e => e.currentTarget.style.opacity = '1'}
                    >
                      ✦ share card
                    </button>

                    <button onClick={() => {console.log('delete clicked', entry.id);
  deleteEntry(entry.id);}} style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10,
                      color: 'var(--text-tertiary)', background: 'none',
                      border: 'none', cursor: 'pointer', padding: 0,
                      letterSpacing: '0.04em'
                    }}
                      onMouseOver={e => e.currentTarget.style.color = 'var(--danger)'}
                      onMouseOut={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                    >
                      delete entry
                    </button>
  
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Insights Tab */}
        {tab === 'insights' && (
          <div className="content-enter">
            <MoodMap entries={entries} theme={theme} />
          </div>
        )}

      </div>

      {/* Share Modal */}
      {sharingEntry && (
        <ShareModal
          entry={sharingEntry}
          theme={theme}
          onClose={() => setSharingEntry(null)}
        />
      )}
    </>
  );
}
