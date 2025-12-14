"use client";
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { AudioManager } from '@/lib/audio';

export default function SessionPage({ params }: { params: { code: string } }) {
  const [connected, setConnected] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [question, setQuestion] = useState<{ prompt: string; choices: string[]; timerSec?: number } | null>(null);
  const [teamScores, setTeamScores] = useState<Record<string, number>>({});
  const [name, setName] = useState('');
  const nameRef = useRef('');
  const teamRef = useRef('');
  const submittedRef = useRef<number | null>(null);
  const sfxRef = useRef(true);
  const [teamInput, setTeamInput] = useState('');
  const [socketRef, setSocketRef] = useState<any>(null);
  const [answered, setAnswered] = useState(false);
  const [submittedIndex, setSubmittedIndex] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [round, setRound] = useState<number>(0);
  const [isHost, setIsHost] = useState(false);
  const [ended, setEnded] = useState<boolean>(false);
  const [audio] = useState(() => (typeof window !== 'undefined' ? new AudioManager() : null));
  const [sfx, setSfx] = useState(true);
  const [loadingState, setLoadingState] = useState(true);
  const [infoMsg, setInfoMsg] = useState('');
  const [resumed, setResumed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const hostParam = new URLSearchParams(window.location.search).get('host');
      setIsHost(hostParam === '1');
    }
  }, []);

  useEffect(() => {
    // load stored profile
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('game-night-profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.name) {
            setName(parsed.name);
            nameRef.current = parsed.name;
          }
          if (parsed.teamName) {
            setTeamInput(parsed.teamName);
            teamRef.current = parsed.teamName;
          }
        }
      } catch (e) {}
    }
  }, [params.code]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000', {
      transports: ['websocket']
    });
    setSocketRef(socket);

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join', { code: params.code, name: nameRef.current, teamName: teamRef.current || undefined });
    });

    socket.on('presence_update', (payload: { players: any[]; teams?: any[] }) => {
      setPlayers(payload.players);
      if (payload.teams) setTeams(payload.teams);
    });

    socket.on('round_start', (payload: any) => {
      setRound(payload.round ?? round);
      audio?.play('start');
    });

    socket.on('question_start', (q: any) => { 
      setQuestion(q); 
      setAnswered(false);
      setSubmittedIndex(null);
      submittedRef.current = null;
      setCorrectIndex(null);
      setResumed(false);
      const total = q.timerSec ?? 20;
      setRemaining(total);
    });
    socket.on('question_end', (payload: any) => { 
      setCorrectIndex(payload.correctIndex);
      setRemaining(null);
      if (submittedRef.current !== null && sfxRef.current) {
        if (submittedRef.current === payload.correctIndex) {
          audio?.play('correct');
        } else {
          audio?.play('incorrect');
        }
      }
    });

    socket.on('scoreboard_update', (payload: any) => {
      if (payload.teamScores) setTeamScores(payload.teamScores);
    });

    socket.on('game_end', () => {
      setEnded(true);
      setQuestion(null);
      setRemaining(null);
      setCorrectIndex(null);
      audio?.play('end');
    });

    return () => {
      socket.disconnect();
    };
  }, [params.code, audio]);

  useEffect(() => {
    // initial state fetch for resume
    const fetchState = async () => {
      try {
        const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${api}/api/sessions/${params.code}/state`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.players) setPlayers(data.players);
        if (data.teams) setTeams(data.teams);
        if (data.teamScores) setTeamScores(data.teamScores);
        if (data.current) {
          setQuestion({ prompt: data.current.prompt, choices: data.current.choices, timerSec: data.current.timerSec });
          setRemaining(data.current.remainingSec ?? data.current.timerSec ?? 0);
          setRound(data.current.round ?? 0);
          setInfoMsg('Question in progress — resume your answer');
          setResumed(true);
        }
      } catch (e) {}
      setLoadingState(false);
    };
    fetchState();
  }, [params.code]);

  useEffect(() => {
    if (remaining === null) return;
    if (remaining <= 0) return;
    const id = setInterval(() => setRemaining(r => (r ? r - 1 : null)), 1000);
    return () => clearInterval(id);
  }, [remaining]);

  return (
    <main style={{ padding: 24 }}>
      <h1 className="title">Lobby / Session {params.code}</h1>
      <p>Round: {round}</p>
      <p>Status: {connected ? 'Connected' : 'Connecting...'}</p>
      {loadingState && <p className="muted">Loading session state…</p>}
      {infoMsg && <p className="muted" style={{ color: 'var(--neon)' }}>{infoMsg}</p>}

      <div style={{ marginBottom: 12 }}>
        <label className="row">
          <span>Sound Effects</span>
          <input type="checkbox" checked={sfx} onChange={() => { setSfx(v => !v); sfxRef.current = !sfxRef.current; audio?.toggle(); }} />
        </label>
      </div>

      <section>
        <h2>Players</h2>
        {isHost && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <button onClick={async () => {
              if (!navigator?.clipboard) {
                setInfoMsg('Clipboard unavailable');
                setTimeout(() => setInfoMsg(''), 1200);
                return;
              }
              const url = `${window.location.origin}/session/${params.code}`;
              await navigator.clipboard.writeText(url);
              setInfoMsg('Invite link copied');
              setTimeout(() => setInfoMsg(''), 1200);
            }}>Copy Invite Link</button>
            {question && correctIndex === null && (
              <button onClick={async () => {
                const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
                await fetch(`${api}/api/sessions/${params.code}/question/end`, { method: 'POST' });
              }} style={{ background: 'var(--accent)', border: '1px solid var(--neon)' }}>End Question Now</button>
            )}
          </div>
        )}
        {teams.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            {teams.map((t) => (
              <div key={t.name} style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between', maxWidth: 380 }}>
                <strong style={{ color: 'var(--neon)' }}>{t.name}</strong>
                <span className="muted">{t.count} player{t.count !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        )}
        <ul>
          {players.map((p: any, idx: number) => {
            const nameVal = typeof p === 'string' ? p : p.name;
            const teamVal = typeof p === 'string' ? undefined : p.teamName;
            return (
              <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 420, gap: 8 }}>
                <span>{nameVal}</span>
                {teamVal && <span style={{ padding: '2px 8px', borderRadius: 12, border: '1px solid var(--neon)', color: 'var(--neon)', fontSize: 12 }}>{teamVal}</span>}
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2>Your Display Name</h2>
        <input
          value={name}
          onChange={e => {
            setName(e.target.value);
            nameRef.current = e.target.value;
            if (socketRef) {
              socketRef.emit('name_update', { code: params.code, name: e.target.value });
            }
          }}
          placeholder="Type your name"
        />
        <div style={{ marginTop: 8 }}>
          <label>Team Name (optional)</label>
          <input
            value={teamInput}
            onChange={e => setTeamInput(e.target.value)}
            placeholder="Set or change your team"
          />
          <button style={{ marginTop: 6 }} disabled={!teamInput.trim()} onClick={() => {
            if (!socketRef) return;
            const next = teamInput.trim();
            teamRef.current = next;
            socketRef.emit('team_update', { code: params.code, teamName: next });
            if (typeof window !== 'undefined') {
              localStorage.setItem('game-night-profile', JSON.stringify({ name: nameRef.current || name, teamName: next }));
            }
          }}>Update Team</button>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {!question && !ended && (
            <button onClick={async () => {
              const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
              await fetch(`${api}/api/sessions/${params.code}/start`, { method: 'POST' });
            }}>Start Round</button>
          )}
          {correctIndex !== null && isHost && (
            <button onClick={async () => {
              const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
              await fetch(`${api}/api/sessions/${params.code}/round/next`, { method: 'POST' });
            }}>Next Round</button>
          )}
        </div>
      </section>

      {question && !ended && (
        <section className="panel">
          {mounted && resumed && <div style={{ marginBottom: 8, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--neon)', color: 'var(--neon)', background: 'rgba(0,0,0,0.3)' }}>Rejoined mid-question — submit before time runs out.</div>}
          <h2>{question.prompt}</h2>
          <p>Time left: {remaining ?? 0}s</p>
          <ul className="choices">
            {question.choices.map((c: string, i: number) => (
              <li key={i}>
                <button
                  className="choice-btn"
                  style={correctIndex === null ? undefined : (i === correctIndex ? { background: 'var(--success)', color: 'var(--bg)' } : { opacity: 0.7 })}
                  disabled={answered || correctIndex !== null}
                  onClick={() => {
                    if (!socketRef) return;
                    socketRef.emit('answer_submit', { code: params.code, index: i, timeMs: 0 });
                    setAnswered(true);
                    setSubmittedIndex(i);
                    submittedRef.current = i;
                  }}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
          {answered && <p className="muted">Answer submitted! Waiting for results…</p>}
          {correctIndex !== null && (
            <div style={{ marginTop: 12 }}>
              <button onClick={async () => {
                const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
                await fetch(`${api}/api/sessions/${params.code}/round/next`, { method: 'POST' });
              }}>Next Question</button>
            </div>
          )}
        </section>
      )}

      <section>
        <h2>Leaderboard</h2>
        {Object.keys(teamScores).length === 0 && <p className="muted">No scores yet.</p>}
        {Object.keys(teamScores).length > 0 && (() => {
          const sorted = Object.entries(teamScores).sort((a, b) => b[1] - a[1]);
          const topScore = Math.max(...sorted.map(([, v]) => v), 1);
          return (
            <ul style={{ maxWidth: 420 }}>
              {sorted.map(([team, pts], idx) => {
                const pct = Math.max(6, Math.round((pts / topScore) * 100));
                return (
                  <li key={team} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: idx === 0 ? 'var(--neon)' : 'var(--text)' }}>{team}</span>
                      <strong>{pts}</strong>
                    </div>
                    <div style={{ height: 10, background: 'var(--panel)', borderRadius: 999, overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: idx === 0 ? 'var(--neon)' : 'var(--accent)', transition: 'width 0.3s ease' }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          );
        })()}
        {ended && (
          <div style={{ marginTop: 16 }}>
            <h3>Game Over</h3>
            <p>Thanks for playing! Final scores above.</p>
          </div>
        )}
      </section>
    </main>
  );
}
