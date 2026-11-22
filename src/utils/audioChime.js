/**
 * Native HTML5 Web Audio API Chime & Speech Synthesizer
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

export const CHIME_PRESETS = [
  {
    id: 'atelier',
    nameKey: 'chimeAtelierName',
    descKey: 'chimeAtelierDesc',
    defaultName: 'Atelier Lounge',
    defaultDesc: 'Classic 3-tone ascending hotel chime'
  },
  {
    id: 'celestial',
    nameKey: 'chimeCelestialName',
    descKey: 'chimeCelestialDesc',
    defaultName: 'Celestial Crystal',
    defaultDesc: 'Bright silvery double-bell chime'
  },
  {
    id: 'marimba',
    nameKey: 'chimeMarimbaName',
    descKey: 'chimeMarimbaDesc',
    defaultName: 'Warm Marimba',
    defaultDesc: 'Organic acoustic wooden percussion'
  },
  {
    id: 'zenGong',
    nameKey: 'chimeZenGongName',
    descKey: 'chimeZenGongDesc',
    defaultName: 'Zen Temple Gong',
    defaultDesc: 'Deep resonant meditative acoustic ring'
  }
];

/**
 * Play a specific synthesized chime preset
 */
export function playChimePreset(presetId = 'atelier') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;

    switch (presetId) {
      case 'celestial': {
        // High Crystal Double Bell (A5 + E6 + A6)
        const tones = [
          { freq: 880, start: startTime, dur: 0.6, gain: 0.25 },
          { freq: 1318.5, start: startTime + 0.12, dur: 0.8, gain: 0.28 },
          { freq: 1760, start: startTime + 0.12, dur: 0.5, gain: 0.12 }
        ];

        tones.forEach(({ freq, start, dur, gain: maxGain }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(maxGain, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0005, start + dur);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + dur);
        });
        break;
      }

      case 'marimba': {
        // Warm 4-note acoustic wooden roll (F4 -> A4 -> C5 -> F5)
        const notes = [
          { freq: 349.23, start: startTime, dur: 0.35 },
          { freq: 440.0, start: startTime + 0.12, dur: 0.35 },
          { freq: 523.25, start: startTime + 0.24, dur: 0.4 },
          { freq: 698.46, start: startTime + 0.36, dur: 0.55 }
        ];

        notes.forEach(({ freq, start, dur }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.28, start + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0008, start + dur);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + dur);
        });
        break;
      }

      case 'zenGong': {
        // Deep Resonant Bronze Gong with rich low harmonics
        const gongHarmonics = [
          { freq: 146.83, start: startTime, dur: 1.5, gain: 0.35 }, // D3 fundamental
          { freq: 220.0, start: startTime, dur: 1.3, gain: 0.25 },  // A3 fifth
          { freq: 293.66, start: startTime, dur: 1.1, gain: 0.2 },  // D4 octave
          { freq: 440.0, start: startTime, dur: 0.8, gain: 0.1 }   // A4 shimmer
        ];

        gongHarmonics.forEach(({ freq, start, dur, gain: maxGain }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(maxGain, start + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0005, start + dur);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + dur);
        });
        break;
      }

      case 'atelier':
      default: {
        // Classic 3-tone ascending hotel chime (C5 -> E5 -> G5)
        const tones = [
          { freq: 523.25, start: startTime, dur: 0.3 },        // C5
          { freq: 659.25, start: startTime + 0.18, dur: 0.35 }, // E5
          { freq: 783.99, start: startTime + 0.38, dur: 0.6 }   // G5
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
        break;
      }
    }
  } catch (err) {
    console.warn('Chime playback error:', err);
  }
}

/**
 * Backward compatibility alias
 */
export function playCallAlertSound(presetId = 'atelier') {
  playChimePreset(presetId);
}

export function playChime() {
  playChimePreset('atelier');
}

export function playSoftPing() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, startTime);

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
 * Retrieve Indian-origin voices from the browser's speech synthesis engine
 */
export function getIndianVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  const allVoices = window.speechSynthesis.getVoices() || [];
  
  // Filter specifically for Indian English & Indian regional voices
  const indianVoices = allVoices.filter(v => {
    const lang = (v.lang || '').toLowerCase();
    const name = (v.name || '').toLowerCase();
    return (
      lang.includes('en-in') ||
      lang.includes('hi-in') ||
      lang.includes('gu-in') ||
      name.includes('india') ||
      name.includes('heera') ||
      name.includes('ravi') ||
      name.includes('neerja') ||
      name.includes('veena') ||
      name.includes('rishi') ||
      name.includes('sangeeta') ||
      name.includes('kavya') ||
      name.includes('prabhat')
    );
  });

  // Fallback to all English voices if the OS does not have specific Indian language packs
  if (indianVoices.length === 0) {
    return allVoices.filter(v => (v.lang || '').toLowerCase().startsWith('en'));
  }
  return indianVoices;
}

/**
 * Spoken Turn Announcement with Indian Accent & Customizable Chime
 */
export function speakCustomerAnnouncement({
  token,
  barber,
  language = 'en',
  chimeId = 'atelier',
  voiceUri = null,
  playChime = true,
  playVoice = true,
  onComplete
}) {
  // If neither chime nor voice is enabled, exit
  if (!playChime && !playVoice) {
    if (onComplete) onComplete();
    return;
  }

  // 1. Play selected chime if enabled
  if (playChime) {
    playChimePreset(chimeId);
  }

  // If voice is disabled, finish after chime
  if (!playVoice) {
    if (onComplete) setTimeout(onComplete, 1200);
    return;
  }

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onComplete) onComplete();
    return;
  }

  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }

  // Wait for the chime to complete before speaking
  const delayMs = playChime ? 750 : 50;

  setTimeout(() => {
    try {
      const barberName = barber
        ? (language === 'gu' && barber.gujaratiName ? barber.gujaratiName : barber.name)
        : 'Stylist';
      const chairNum = barber?.chair || 1;
      const customer = token?.customerName || 'Guest';
      const tokenId = token?.id || '';

      const spokenText = language === 'gu'
        ? `ટોકન ${tokenId}. ${customer}, કૃપા કરીને ${barberName} સાથે ખુરશી નંબર ${chairNum} પર પધારો.`
        : `Token ${tokenId}. ${customer}, please proceed to Chair ${chairNum} with ${barberName}.`;

      const utterance = new SpeechSynthesisUtterance(spokenText);
      
      // Calibrated speech cadence for natural human room announcement
      utterance.rate = 0.89; // Slightly relaxed pace (less robotic, more natural human cadence)
      utterance.pitch = 1.0;
      utterance.lang = language === 'gu' ? 'gu-IN' : 'en-IN';

      // Select chosen voice or best Indian voice
      const voices = window.speechSynthesis.getVoices() || [];
      if (voices.length > 0) {
        let chosenVoice = null;
        
        // 1. Try selected voiceUri from user settings
        if (voiceUri) {
          chosenVoice = voices.find(v => v.voiceURI === voiceUri || v.name === voiceUri);
        }

        // 2. Prioritize Indian English voices (Microsoft Heera, Ravi, Google English India)
        if (!chosenVoice) {
          chosenVoice = voices.find(v => 
            (v.lang && v.lang.toLowerCase().includes('en-in')) ||
            (v.name && (v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('heera') || v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('neerja')))
          );
        }

        // 3. Fallback to any natural English voice
        if (!chosenVoice) {
          chosenVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en') && v.name.toLowerCase().includes('natural'));
        }

        if (chosenVoice) {
          utterance.voice = chosenVoice;
        }
      }

      if (onComplete) {
        utterance.onend = onComplete;
        utterance.onerror = onComplete;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      if (onComplete) onComplete();
    }
  }, delayMs);
}
