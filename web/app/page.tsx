export default function HomePage() {
  return (
    <main style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1 className="title" style={{ fontSize: 48, marginBottom: 8 }}>Game Night</h1>
      <p className="muted" style={{ fontSize: 18, marginBottom: 32 }}>A modern, console-style trivia game.</p>
      <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <a href="/host" style={{ textAlign: 'center', padding: 16, background: 'var(--neon)', color: 'var(--bg)', borderRadius: 'var(--radius)', fontWeight: 600, fontSize: 18 }}>Host a Game</a>
        <a href="/join" style={{ textAlign: 'center', padding: 16, background: 'var(--panel)', color: 'var(--text)', border: '2px solid var(--neon)', borderRadius: 'var(--radius)', fontWeight: 600, fontSize: 18 }}>Join a Game</a>
      </div>
    </main>
  );
}
