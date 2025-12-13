export class AudioManager {
  private ctx: AudioContext | null = null;
  private enabled = true;

  toggle() {
    this.enabled = !this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  private ensureCtx() {
    if (!this.ctx) this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Simple synth beep cues
  play(type: 'join' | 'start' | 'correct' | 'incorrect' | 'end') {
    if (!this.enabled) return;
    this.ensureCtx();
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    const now = ctx.currentTime;
    const dur = 0.15;
    const base = {
      join: 440,
      start: 660,
      correct: 880,
      incorrect: 220,
      end: 330
    }[type];
    o.frequency.setValueAtTime(base, now);
    g.gain.setValueAtTime(0.001, now);
    g.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.connect(g).connect(ctx.destination);
    o.start(now);
    o.stop(now + dur);
  }
}
