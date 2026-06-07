import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { formatTime } from '../utils/formatTime';

export function Recorder({ onEntryReady, disabled }) {
  const {
    isRecording, transcript, seconds, error,
    startRecording, stopRecording, clearTranscript, setTranscript
  } = useVoiceRecorder();

  const hasText = transcript.trim().length > 10;

  function handleSubmit() {
    if (!hasText || disabled) return;
    onEntryReady(transcript.trim());
    clearTranscript();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Mic area */}
      <div style={{
        border: '1px solid var(--border)',
        borderRadius: 20, padding: '32px 24px',
        background: 'var(--bg-card)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 16,
        transition: 'border-color 0.2s',
        borderColor: isRecording ? 'var(--danger)' : 'var(--border)'
      }}>

        {/* Mic button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled}
          style={{
            width: 72, height: 72, borderRadius: '50%',
            border: isRecording ? '2px solid var(--danger)' : '1px solid var(--border)',
            background: isRecording ? 'var(--danger-bg)' : 'var(--bg-hover)',
            fontSize: 26, cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: isRecording ? 'pulse 1.5s ease-in-out infinite' : 'none',
            transition: 'all 0.2s', opacity: disabled ? 0.5 : 1
          }}
        >
          {isRecording ? '⏹' : '🎙'}
        </button>

        {/* Waveform bars */}
        {isRecording && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 24 }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{
                width: 3, height: '100%',
                background: 'var(--danger)',
                borderRadius: 2, opacity: 0.7,
                transformOrigin: 'center',
                animation: `waveBar ${0.5 + Math.random() * 0.5}s ${Math.random() * 0.4}s ease-in-out infinite`
              }} />
            ))}
          </div>
        )}

        {/* Status */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 12,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: isRecording ? 'var(--danger)' : 'var(--text-tertiary)'
        }}>
          {isRecording ? `recording · ${formatTime(seconds)}` : 'tap to begin'}
        </div>

        {error && (
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--danger)', textAlign: 'center'
          }}>{error}</p>
        )}
      </div>

      {/* Textarea */}
      <textarea
        value={transcript}
        onChange={e => setTranscript(e.target.value)}
        placeholder="words will appear here as you speak — or write directly..."
        rows={5}
        style={{
          width: '100%', fontFamily: 'var(--font-display)',
          fontSize: 15, lineHeight: 1.75,
          fontStyle: transcript ? 'italic' : 'normal',
          padding: '16px', border: '1px solid var(--border)',
          borderRadius: 14, resize: 'vertical',
          background: 'var(--bg-card)', color: 'var(--text-primary)',
          outline: 'none', transition: 'border-color 0.2s',
          boxShadow: 'var(--shadow-sm)'
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!hasText || disabled}
        style={{
          padding: '14px', borderRadius: 14,
          border: '1px solid var(--border)',
          background: hasText && !disabled ? 'var(--text-primary)' : 'var(--bg-hover)',
          color: hasText && !disabled ? 'var(--bg)' : 'var(--text-tertiary)',
          fontFamily: 'var(--font-mono)', fontSize: 12,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          cursor: hasText && !disabled ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s'
        }}
      >
        ✦ analyse & save entry
      </button>
    </div>
  );
}