/**
 * Native HTML5 Web Audio API Chime Generator
 * Synthesizes a soothing 2-tone chime:
 * Tone 1: C5 (523.25 Hz) for 250ms
 * Tone 2: E5 (659.25 Hz) for 400ms
 * Zero external audio file dependencies!
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;

    // First tone: C5 (523.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, startTime);

    gain1.gain.setValueAtTime(0, startTime);
    gain1.gain.linearRampToValueAtTime(0.25, startTime + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(startTime);
    osc1.stop(startTime + 0.25);

    // Second tone: E5 (659.25 Hz) starting slightly after first
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    const secondStart = startTime + 0.2;
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, secondStart);

    gain2.gain.setValueAtTime(0, secondStart);
    gain2.gain.linearRampToValueAtTime(0.3, secondStart + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, secondStart + 0.45);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(secondStart);
    osc2.stop(secondStart + 0.45);
  } catch (err) {
    console.warn('Web Audio chime could not play:', err);
  }
}

export function playSoftPing() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, startTime); // A5

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.15, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.2);
  } catch (err) {
    console.warn('Soft ping error:', err);
  }
}

/**
 * TV Wall Display Announcement Alert Sound
 * Elegant 3-tone ascending chime (C5 -> E5 -> G5) to announce newly called guest
 */
export function playCallAlertSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;
    const tones = [
      { freq: 523.25, start: startTime, dur: 0.28 },       // C5
      { freq: 659.25, start: startTime + 0.18, dur: 0.32 }, // E5
      { freq: 783.99, start: startTime + 0.38, dur: 0.55 }  // G5
    ];

    tones.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.3, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0008, start + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + dur);
    });
  } catch (err) {
    console.warn('Call alert chime could not play:', err);
  }
}
