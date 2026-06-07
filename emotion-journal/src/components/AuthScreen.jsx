import { useState } from 'react';

export function AuthScreen({ onLogin, onSignup, onGoogle, error, loading,onBack }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (mode === 'login') onLogin(email, password);
    else onSignup(email, password, name);
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    fontFamily: 'var(--font-mono)', fontSize: 13,
    border: '1px solid var(--border)',
    borderRadius: 12, background: 'var(--bg-card)',
    color: 'var(--text-primary)', outline: 'none',
    letterSpacing: '0.02em',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        animation: 'fadeUp 0.5s ease both'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 36, fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: 6
          }}>
            Lumis
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text-tertiary)',
            letterSpacing: '0.08em', textTransform: 'uppercase'
          }}>
            speak. feel. understand.
          </p>
        </div>

        {onBack && (
  <button onClick={onBack} style={{
    display: 'flex', alignItems: 'center', gap: 6,
    fontFamily: 'var(--font-mono)', fontSize: 11,
    color: 'var(--text-tertiary)', background: 'none',
    border: 'none', cursor: 'pointer', padding: '0 0 20px',
    letterSpacing: '0.04em'
  }}>
    ← back
  </button>
)}

        {/* Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 20, padding: '32px',
          boxShadow: 'var(--shadow-md)'
        }}>

          {/* Mode toggle */}
          <div style={{
            display: 'flex', marginBottom: 28,
            background: 'var(--bg-hover)',
            borderRadius: 10, padding: 4
          }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '8px',
                border: 'none', borderRadius: 8,
                background: mode === m ? 'var(--bg-card)' : 'transparent',
                color: mode === m ? 'var(--text-primary)' : 'var(--text-tertiary)',
                fontFamily: 'var(--font-mono)', fontSize: 11,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                cursor: 'pointer', fontWeight: mode === m ? 500 : 400,
                boxShadow: mode === m ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s'
              }}>
                {m === 'login' ? 'sign in' : 'sign up'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mode === 'signup' && (
              <input
                type="text" placeholder="your name"
                value={name} onChange={e => setName(e.target.value)}
                required style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(44,95,46,0.08)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            )}
            <input
              type="email" placeholder="email address"
              value={email} onChange={e => setEmail(e.target.value)}
              required style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(44,95,46,0.08)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
            <input
              type="password" placeholder="password"
              value={password} onChange={e => setPassword(e.target.value)}
              required style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(44,95,46,0.08)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />

            {error && (
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--danger)', background: 'var(--danger-bg)',
                padding: '8px 12px', borderRadius: 8,
                letterSpacing: '0.02em', animation: 'slideIn 0.2s ease'
              }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              marginTop: 4, padding: '13px',
              borderRadius: 12, border: '1px solid var(--border)',
              background: loading ? 'var(--bg-hover)' : 'var(--text-primary)',
              color: loading ? 'var(--text-tertiary)' : 'var(--bg)',
              fontFamily: 'var(--font-mono)', fontSize: 12,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}>
              {loading ? 'please wait...' : mode === 'login' ? 'sign in' : 'create account'}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 12, margin: '20px 0'
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--text-tertiary)', letterSpacing: '0.06em'
            }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Google button */}
          <button onClick={onGoogle} disabled={loading} style={{
            width: '100%', padding: '13px',
            borderRadius: 12, border: '1px solid var(--border)',
            background: 'var(--bg-hover)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)', fontSize: 12,
            letterSpacing: '0.06em',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 10
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            continue with google
          </button>
        </div>

        <p style={{
          textAlign: 'center', marginTop: 20,
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--text-tertiary)', letterSpacing: '0.04em'
        }}>
          your journal is private and encrypted
        </p>
      </div>
    </div>
  );
}