"use client";
import { useState } from 'react';

export default function HostPage() {
  const [rounds, setRounds] = useState(10);
  const [timer, setTimer] = useState(20);
  const [category, setCategory] = useState('80s Pop Culture');
  const [code, setCode] = useState<string | null>(null);
  const [copyMsg, setCopyMsg] = useState<string>('');
  const [loading, setLoading] = useState(false);

  async function createSession() {
    setLoading(true);
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${api}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, roundConfig: { questions: rounds, timerSec: timer } })
      });
      const data = await res.json();
      setCode(data.code);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--neon)', marginBottom: 16 }}>Host a Game</h1>
      
      <div className="panel">
        <label style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>Category</span>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option>80s Pop Culture</option>
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>Questions per game</span>
          <input type="number" value={rounds} onChange={e => setRounds(parseInt(e.target.value || '10'))} />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>Timer per question (sec)</span>
          <input type="number" value={timer} onChange={e => setTimer(parseInt(e.target.value || '20'))} />
        </label>

        <button onClick={createSession} disabled={loading} style={{ width: '100%', marginTop: 8 }}>
          {loading ? 'Creating...' : 'Create Session'}
        </button>
      </div>

      {code && (
        <div className="panel" style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: 16 }}>Share this code with your players:</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--neon)', letterSpacing: 4, margin: '12px 0' }}>{code}</p>
          
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            <button onClick={async () => {
              if (!navigator?.clipboard) {
                setCopyMsg('Clipboard unavailable');
                return;
              }
              await navigator.clipboard.writeText(code);
              setCopyMsg('Code copied');
              setTimeout(() => setCopyMsg(''), 1200);
            }}>Copy Code</button>
            <button onClick={async () => {
              if (!navigator?.clipboard) {
                setCopyMsg('Clipboard unavailable');
                return;
              }
              const url = `${window.location.origin}/session/${code}`;
              await navigator.clipboard.writeText(url);
              setCopyMsg('Invite link copied');
              setTimeout(() => setCopyMsg(''), 1200);
            }}>Copy Invite Link</button>
          </div>

          {copyMsg && <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 12 }}>{copyMsg}</p>}

          <a href={`/session/${code}?host=1`} style={{ display: 'inline-block', padding: '12px 24px', background: 'var(--neon)', color: 'var(--bg)', borderRadius: 'var(--radius)', fontWeight: 600, marginTop: 8 }}>Go to Lobby</a>
        </div>
      )}
    </main>
  );
}
