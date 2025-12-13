"use client";
import { useState } from 'react';

export default function HostPage() {
  const [rounds, setRounds] = useState(10);
  const [timer, setTimer] = useState(20);
  const [category, setCategory] = useState('80s Pop Culture');
  const [code, setCode] = useState<string | null>(null);
  const [copyMsg, setCopyMsg] = useState<string>('');

  async function createSession() {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${api}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, roundConfig: { questions: rounds, timerSec: timer } })
    });
    const data = await res.json();
    setCode(data.code);
  }

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1 className="title">Host a Game</h1>
      <div className="panel">
        <label>Category
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--neon)' }}>
            <option>80s Pop Culture</option>
          </select>
        </label>
        <label>Questions per game
          <input type="number" value={rounds} onChange={e => setRounds(parseInt(e.target.value || '10'))} style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--neon)' }} />
        </label>
        <label>Timer per question (sec)
          <input type="number" value={timer} onChange={e => setTimer(parseInt(e.target.value || '20'))} style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--neon)' }} />
        </label>
        <button onClick={createSession} style={{ width: '100%', marginTop: 8 }}>Create Session</button>
      </div>
      {code && (
        <div className="panel" style={{ textAlign: 'center' }}>
          <p>Share this code with your players:</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--neon)', letterSpacing: 4, margin: '12px 0' }}>{code}</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
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
          {copyMsg && <p className="muted" style={{ marginTop: 6 }}>{copyMsg}</p>}
          <a href={`/session/${code}?host=1`} style={{ display: 'inline-block', padding: '12px 24px', background: 'var(--neon)', color: 'var(--bg)', borderRadius: 'var(--radius)', fontWeight: 600, marginTop: 8 }}>Go to Lobby</a>
        </div>
      )}
    </main>
  );
}
