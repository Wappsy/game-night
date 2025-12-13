"use client";
import { useState } from 'react';

export default function JoinPage() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamMode, setTeamMode] = useState<'create' | 'join' | null>(null);
  const [hint, setHint] = useState('');

  async function join() {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${api}/api/sessions/${code}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: name, teamName: teamName || undefined })
    });
    if (res.ok) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('game-night-profile', JSON.stringify({ name, teamName: teamName || undefined }));
      }
      window.location.href = `/session/${code}`;
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1 className="title">Join a Game</h1>
      <div className="panel">
        <label>Session Code
          <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="Enter code" style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--neon)', fontSize: 18, textAlign: 'center', letterSpacing: 2 }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button style={{ flex: 1 }} onClick={async () => {
              if (!navigator?.clipboard) {
                setHint('Clipboard unavailable');
                return;
              }
              const text = await navigator.clipboard.readText();
              if (text) {
                setCode(text.trim().toUpperCase());
                setHint('Pasted from clipboard');
                setTimeout(() => setHint(''), 1200);
              }
            }}>Paste Code</button>
            <button style={{ flex: 1 }} onClick={() => {
              setCode('');
            }}>Clear</button>
          </div>
        </label>
        <label>Your Name
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--neon)' }} />
        </label>
        
        <div style={{ marginTop: 16 }}>
          <p style={{ marginBottom: 12, fontWeight: 500 }}>Team Options (optional)</p>
          <p className="muted" style={{ marginTop: -8, marginBottom: 12 }}>Leave blank to play solo. Create a name to start a new team, or type an existing team name to join it.</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button onClick={() => setTeamMode(teamMode === 'create' ? null : 'create')} style={{ flex: 1, background: teamMode === 'create' ? 'var(--neon)' : 'var(--panel)', border: '2px solid var(--neon)', color: teamMode === 'create' ? 'var(--bg)' : 'var(--text)' }}>Create Team</button>
            <button onClick={() => setTeamMode(teamMode === 'join' ? null : 'join')} style={{ flex: 1, background: teamMode === 'join' ? 'var(--neon)' : 'var(--panel)', border: '2px solid var(--neon)', color: teamMode === 'join' ? 'var(--bg)' : 'var(--text)' }}>Join Team</button>
          </div>
          {teamMode && (
            <label>Team Name
              <input value={teamName} onChange={e => setTeamName(e.target.value)} placeholder={teamMode === 'create' ? 'Create a team name' : 'Enter existing team name'} style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--neon)' }} />
            </label>
          )}
        </div>

        <button onClick={join} disabled={!code || !name} style={{ width: '100%', marginTop: 8 }}>Join</button>
        {hint && <p className="muted" style={{ marginTop: 8 }}>{hint}</p>}
      </div>
    </main>
  );
}
