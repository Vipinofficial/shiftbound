
class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  private init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.3; // Global volume
    this.masterGain.connect(this.ctx.destination);
  }

  private async resume() {
    this.init();
    if (this.ctx?.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  playJump() {
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);
    g.gain.setValueAtTime(0.5, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playShift() {
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.3);
    g.gain.setValueAtTime(0.2, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playSize() {
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.15);
    g.gain.setValueAtTime(0.3, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playCollect() {
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.05);
      g.gain.setValueAtTime(0.2, now + i * 0.05);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.4);
      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.4);
    });
  }

  playFail() {
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(20, this.ctx.currentTime + 0.5);
    g.gain.setValueAtTime(0.2, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  playLavaSplash() {
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const burst = this.ctx.createOscillator();
    const burstGain = this.ctx.createGain();
    burst.type = 'triangle';
    burst.frequency.setValueAtTime(190, now);
    burst.frequency.exponentialRampToValueAtTime(70, now + 0.18);
    burstGain.gain.setValueAtTime(0.24, now);
    burstGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    burst.connect(burstGain);
    burstGain.connect(this.masterGain);
    burst.start(now);
    burst.stop(now + 0.2);

    const hiss = this.ctx.createOscillator();
    const hissGain = this.ctx.createGain();
    hiss.type = 'sawtooth';
    hiss.frequency.setValueAtTime(820, now);
    hiss.frequency.exponentialRampToValueAtTime(260, now + 0.35);
    hissGain.gain.setValueAtTime(0.08, now + 0.03);
    hissGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    hiss.connect(hissGain);
    hissGain.connect(this.masterGain);
    hiss.start(now + 0.03);
    hiss.stop(now + 0.4);
  }

  playPortalTeleport() {
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const whoosh = this.ctx.createOscillator();
    const whooshGain = this.ctx.createGain();
    whoosh.type = 'sine';
    whoosh.frequency.setValueAtTime(260, now);
    whoosh.frequency.exponentialRampToValueAtTime(980, now + 0.32);
    whooshGain.gain.setValueAtTime(0.18, now);
    whooshGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    whoosh.connect(whooshGain);
    whooshGain.connect(this.masterGain);
    whoosh.start(now);
    whoosh.stop(now + 0.35);

    const shimmer = this.ctx.createOscillator();
    const shimmerGain = this.ctx.createGain();
    shimmer.type = 'triangle';
    shimmer.frequency.setValueAtTime(620, now + 0.05);
    shimmer.frequency.linearRampToValueAtTime(360, now + 0.38);
    shimmerGain.gain.setValueAtTime(0.1, now + 0.05);
    shimmerGain.gain.exponentialRampToValueAtTime(0.01, now + 0.42);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(this.masterGain);
    shimmer.start(now + 0.05);
    shimmer.stop(now + 0.42);
  }

  playWin() {
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.1);
      g.gain.setValueAtTime(0.2, now + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.6);
      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.6);
    });
  }

  playClick() {
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, this.ctx.currentTime);
    g.gain.setValueAtTime(0.1, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }
}

export const audio = new AudioManager();
