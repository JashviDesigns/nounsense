/**
 * Procedural 8-bit / chiptune loop — original composition, no samples, copyright-free.
 * Square lead, triangle bass, noise percussion (NES-style).
 */

const NOTE: Record<string, number> = {
  C2: 65.41,
  F2: 87.31,
  G2: 98.0,
  A2: 110.0,
  C3: 130.81,
  E3: 164.81,
  G3: 196.0,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  G4: 392.0,
  A4: 440.0,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
  C6: 1046.5,
};

/** 64 steps = 4 bars of 16th notes @ 118 BPM */
const BPM = 118;
const STEP_SEC = 60 / BPM / 4;

type Step = { note: string | null; len: number };

/** Cheerful arcade lead — C major, Kirby / puzzle-game feel */
const MELODY: Step[] = [
  { note: "E5", len: 2 },
  { note: "G5", len: 2 },
  { note: "E5", len: 1 },
  { note: "C5", len: 1 },
  { note: "E5", len: 2 },
  { note: "G5", len: 2 },
  { note: "A5", len: 2 },
  { note: "G5", len: 2 },
  { note: "E5", len: 2 },
  { note: "C5", len: 2 },
  { note: "D5", len: 2 },
  { note: "E5", len: 2 },
  { note: "G5", len: 4 },
  { note: "E5", len: 2 },
  { note: "C5", len: 2 },
  { note: "E5", len: 2 },
  { note: "G5", len: 2 },
  { note: "B5", len: 2 },
  { note: "A5", len: 2 },
  { note: "G5", len: 2 },
  { note: "E5", len: 2 },
  { note: "G5", len: 2 },
  { note: "A5", len: 2 },
  { note: "G5", len: 2 },
  { note: "E5", len: 2 },
  { note: "C5", len: 2 },
  { note: "D5", len: 2 },
  { note: "C5", len: 2 },
  { note: null, len: 4 },
  { note: "E5", len: 2 },
  { note: "G5", len: 2 },
  { note: "C6", len: 4 },
];

/** Root bass on quarter beats */
const BASS: (string | null)[] = [
  "C2", "C2", "G2", "G2", "A2", "A2", "F2", "F2",
  "C2", "C2", "G2", "G2", "A2", "A2", "G2", "G2",
  "C2", "C2", "G2", "G2", "A2", "A2", "F2", "F2",
  "C2", "E3", "G2", "G2", "C2", "C2", "C2", "C2",
  "C2", "C2", "G2", "G2", "A2", "A2", "F2", "F2",
  "C2", "C2", "G2", "G2", "A2", "A2", "G2", "G2",
  "C2", "C2", "G2", "G2", "A2", "A2", "F2", "F2",
  "C2", "G2", "C2", "G2", "C2", "C2", "C2", "C2",
];

/** Kick=1, hat=2, both=3 */
const DRUMS: number[] = [
  1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0,
  1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0,
  1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0,
  1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 1, 1, 0, 2, 0,
];

function expandMelody(pattern: Step[], totalSteps: number): (string | null)[] {
  const out: (string | null)[] = [];
  for (const { note, len } of pattern) {
    for (let i = 0; i < len; i++) {
      out.push(i === 0 ? note : null);
    }
  }
  while (out.length < totalSteps) out.push(null);
  return out.slice(0, totalSteps);
}

const LOOP_STEPS = 64;
const MELODY_STEPS = expandMelody(MELODY, LOOP_STEPS);

export class ChiptuneEngine {
  private ctx: AudioContext;
  private masterGain: GainNode;
  private melodyGain: GainNode;
  private bassGain: GainNode;
  private drumGain: GainNode;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private stepIndex = 0;
  private activeNodes: (OscillatorNode | AudioBufferSourceNode)[] = [];
  private running = false;

  constructor(ctx: AudioContext, destination: GainNode) {
    this.ctx = ctx;
    this.masterGain = ctx.createGain();
    this.melodyGain = ctx.createGain();
    this.bassGain = ctx.createGain();
    this.drumGain = ctx.createGain();
    this.masterGain.gain.value = 0.14;
    this.melodyGain.gain.value = 0.22;
    this.bassGain.gain.value = 0.28;
    this.drumGain.gain.value = 0.18;
    this.melodyGain.connect(this.masterGain);
    this.bassGain.connect(this.masterGain);
    this.drumGain.connect(this.masterGain);
    this.masterGain.connect(destination);
  }

  setVolume(v: number) {
    this.masterGain.gain.value = v;
  }

  private playSquare(freq: number, start: number, dur: number, vol: number) {
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(vol, start);
    g.gain.setValueAtTime(vol, start + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(g);
    g.connect(this.melodyGain);
    osc.start(start);
    osc.stop(start + dur + 0.02);
    this.activeNodes.push(osc);
  }

  private playTriangle(freq: number, start: number, dur: number, vol: number) {
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(vol, start);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(g);
    g.connect(this.bassGain);
    osc.start(start);
    osc.stop(start + dur + 0.02);
    this.activeNodes.push(osc);
  }

  private playNoise(start: number, dur: number, vol: number, freq: number) {
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, start);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(this.drumGain);
    src.start(start);
    src.stop(start + dur);
    this.activeNodes.push(src);
  }

  private tick() {
    const t = this.ctx.currentTime;
    const i = this.stepIndex % LOOP_STEPS;

    const melNote = MELODY_STEPS[i];
    if (melNote) {
      const freq = NOTE[melNote];
      if (freq) this.playSquare(freq, t, STEP_SEC * 0.9, 0.35);
    }

    const bassNote = BASS[i];
    if (bassNote) {
      const freq = NOTE[bassNote];
      if (freq) this.playTriangle(freq, t, STEP_SEC * 1.1, 0.4);
    }

    const drum = DRUMS[i];
    if (drum === 1) {
      this.playNoise(t, 0.08, 0.5, 80);
      this.playSquare(60, t, 0.06, 0.15);
    } else if (drum === 2) {
      this.playNoise(t, 0.04, 0.2, 6000);
    } else if (drum === 3) {
      this.playNoise(t, 0.08, 0.45, 80);
      this.playNoise(t + 0.05, 0.03, 0.15, 7000);
    }

    this.stepIndex++;
    this.pruneNodes();
  }

  private pruneNodes() {
    if (this.activeNodes.length > 80) {
      this.activeNodes = this.activeNodes.slice(-40);
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.stepIndex = 0;
    this.tick();
    this.timerId = setInterval(() => this.tick(), STEP_SEC * 1000);
  }

  stop() {
    this.running = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.activeNodes.forEach((n) => {
      try {
        n.stop();
      } catch {
        /* */
      }
    });
    this.activeNodes = [];
  }

  get isRunning() {
    return this.running;
  }
}

/** One-shot 8-bit SFX helpers */
export function playChipSfx(
  ctx: AudioContext,
  dest: GainNode,
  type: "correct" | "wrong" | "streak" | "complete",
) {
  const t = ctx.currentTime;

  const blip = (
    freq: number,
    when: number,
    dur: number,
    wave: OscillatorType = "square",
    vol = 0.25,
  ) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = wave;
    o.frequency.setValueAtTime(freq, t + when);
    g.gain.setValueAtTime(vol, t + when);
    g.gain.exponentialRampToValueAtTime(0.001, t + when + dur);
    o.connect(g);
    g.connect(dest);
    o.start(t + when);
    o.stop(t + when + dur + 0.02);
  };

  switch (type) {
    case "correct":
      // Coin pickup
      blip(987.77, 0, 0.06, "square", 0.2);
      blip(1318.51, 0.06, 0.08, "square", 0.22);
      break;
    case "wrong":
      // Arcade buzz
      blip(185, 0, 0.12, "square", 0.15);
      blip(146.83, 0.1, 0.15, "square", 0.12);
      break;
    case "streak":
      blip(523.25, 0, 0.05, "square", 0.18);
      blip(659.25, 0.05, 0.05, "square", 0.18);
      blip(783.99, 0.1, 0.05, "square", 0.18);
      blip(1046.5, 0.15, 0.1, "square", 0.22);
      break;
    case "complete":
      const tune = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51];
      tune.forEach((f, i) => blip(f, i * 0.1, 0.12, "square", 0.2));
      blip(523.25, 0.75, 0.35, "triangle", 0.15);
      break;
  }
}
