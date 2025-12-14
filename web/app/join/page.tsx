"use client";
import { useState } from 'react';

export default function JoinPage() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamMode, setTeamMode] = useState<'create' | 'join' | null>(null);
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);

  async function join() {
    setLoading(true);
    try {
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--neon)', marginBottom: 16 }}>Join a Game</h1>
      
      <div className="panel">
        <label style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>Session Code</span>
          <input 
            value={code} 
            onChange={e => setCode(e.target.value.toUpperCase())} 
            placeholder="Enter code" 
            style={{ fontSize: 18, textAlign: 'center', letterSpacing: 2 }}
          />
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
            <button style={{ flex: 1 }} onClick={() => setCode('')}>Clear</button>
          </div>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>Your Name</span>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" />
        </label>

        <div style={{ marginTop: 16, marginBottom: 12 }}>
          <p style={{ marginBottom: 12, fontWeight: 500, color: 'var(--text)' }}>Team Options (optional)</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 12 }}>Leave blank to play solo. Create a name to start a new team, or type an existing team name to join it.</p>
          
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button 
              onClick={() => setTeamMode(teamMode === 'create' ? null : 'create')} 
              style={{ 
                flex: 1, 
                background: teamMode === 'create' ? 'var(--neon)' : 'var(--panel)', 
                border: '2px solid var(--neon)', 
                color: teamMode === 'create' ? 'var(--bg)' : 'var(--text)',
                boxShadow: 'none'
              }}
            >
              Create Team
            </button>
            <button 
              onClick={() => setTeamMode(teamMode === 'join' ? null : 'join')} 
              style={{ 
                flex: 1, 
                background: teamMode === 'join' ? 'var(--neon)' : 'var(--panel)', 
                border: '2px solid var(--neon)', 
                color: teamMode === 'join' ? 'var(--bg)' : 'var(--text)',
                boxShadow: 'none'
              }}
            >
              Join Team
            </button>
          </div>

          {teamMode && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>Team Name</span>
              <input 
                value={teamName} 
                onChange={e => setTeamName(e.target.value)} 
                placeholder={teamMode === 'create' ? 'Create a team name' : 'Enter existing team name'} 
              />
            </label>
          )}
        </div>

        <button onClick={join} disabled={!code || !name || loading} style={{ width: '100%', marginTop: 8 }}>
          {loading ? 'Joining...' : 'Join'}
        </button>
        {hint && <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 8 }}>{hint}</p>}
      </div>
    </main>
  );
}
