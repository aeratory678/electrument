// QWERTYUIOP keys and their unique colors & frequencies, now with note names
const KEYS = [
  { key: 'Q', color: '0,255,255', freq: 261.63, note: 'C4' },
  { key: 'W', color: '255,0,255', freq: 293.66, note: 'D4' },
  { key: 'E', color: '255,255,0', freq: 329.63, note: 'E4' },
  { key: 'R', color: '255,128,0', freq: 349.23, note: 'F4' },
  { key: 'T', color: '0,255,128', freq: 392.00, note: 'G4' },
  { key: 'Y', color: '128,0,255', freq: 440.00, note: 'A4' },
  { key: 'U', color: '0,128,255', freq: 493.88, note: 'B4' },
  { key: 'I', color: '255,0,128', freq: 523.25, note: 'C5' },
  { key: 'O', color: '128,255,0', freq: 587.33, note: 'D5' },
  { key: 'P', color: '0,255,64', freq: 659.25, note: 'E5' },
];

const keyboard = document.getElementById('keyboard');
let audioCtx;

function createKey({ key, color, note, isBlack }) {
  const el = document.createElement('div');
  el.className = isBlack ? 'key black-key' : 'key';
  el.dataset.key = key;
  el.style.boxShadow = isBlack ? '' : `0 0 0 0 rgba(${color},0.7)`;
  el.innerHTML = `<span class="key-label"><span>${note}</span><span style='font-size:0.7em;opacity:0.7;'>${key}</span></span>`;
  return el;
}

// New: Define both white and black keys for a single octave
const WHITE_KEYS = [
  { note: 'C', key: 'Q', color: '0,255,255' },
  { note: 'D', key: 'W', color: '255,0,255' },
  { note: 'E', key: 'E', color: '255,255,0' },
  { note: 'F', key: 'R', color: '255,128,0' },
  { note: 'G', key: 'T', color: '0,255,128' },
  { note: 'A', key: 'Y', color: '128,0,255' },
  { note: 'B', key: 'U', color: '0,128,255' },
  { note: 'C', key: 'I', color: '255,0,128' },
  { note: 'D', key: 'O', color: '128,255,0' },
  { note: 'E', key: 'P', color: '0,255,64' },
];
const BLACK_KEYS = [
  { note: 'C#', key: '1' },
  { note: 'D#', key: '2' },
  null, // No black key between E and F
  { note: 'F#', key: '4' },
  { note: 'G#', key: '5' },
  { note: 'A#', key: '6' },
  null, // No black key between B and C
  { note: 'C#', key: '8' },
  { note: 'D#', key: '9' },
  null
];

let instrumentType = 'piano'; // Default instrument

// Instrument dropdown logic
const instrumentSelect = document.getElementById('instrument-select');
if (instrumentSelect) {
  instrumentSelect.value = instrumentType; // Set default
  instrumentSelect.addEventListener('change', (e) => {
    instrumentType = e.target.value;
  });
}

function playTone(freq) {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  // Instrument sound selection
  switch (instrumentType) {
    case 'synth':
      osc.type = 'triangle';
      break;
    case 'organ':
      osc.type = 'square';
      break;
    case 'piano':
    default:
      osc.type = 'sine';
      break;
  }
  osc.frequency.value = freq;
  gain.gain.value = 0.18;
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  setTimeout(() => {
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.12);
    osc.stop(audioCtx.currentTime + 0.13);
  }, 180);
}

function activateKey(key) {
  const idx = KEYS.findIndex(k => k.key === key);
  if (idx === -1) return;
  const el = keyboard.children[idx];
  el.classList.add('active');
  el.style.boxShadow = `0 0 32px 12px rgba(${KEYS[idx].color},0.85)`;
  playTone(KEYS[idx].freq);
}

function deactivateKey(key) {
  const idx = KEYS.findIndex(k => k.key === key);
  if (idx === -1) return;
  const el = keyboard.children[idx];
  el.classList.remove('active');
  el.style.boxShadow = `0 0 0 0 rgba(${KEYS[idx].color},0.7)`;
}

let currentOctave = 4;
const baseNotes = [
  { note: 'C', semitone: 0 },
  { note: 'D', semitone: 2 },
  { note: 'E', semitone: 4 },
  { note: 'F', semitone: 5 },
  { note: 'G', semitone: 7 },
  { note: 'A', semitone: 9 },
  { note: 'B', semitone: 11 },
  { note: 'C', semitone: 12 },
  { note: 'D', semitone: 14 },
  { note: 'E', semitone: 16 },
];

const chromaticNotes = [
  { note: 'C', semitone: 0 },
  { note: 'C#', semitone: 1 },
  { note: 'D', semitone: 2 },
  { note: 'D#', semitone: 3 },
  { note: 'E', semitone: 4 },
  { note: 'F', semitone: 5 },
  { note: 'F#', semitone: 6 },
  { note: 'G', semitone: 7 },
  { note: 'G#', semitone: 8 },
  { note: 'A', semitone: 9 },
  { note: 'A#', semitone: 10 },
  { note: 'B', semitone: 11 }
];

let scaleMode = 'major';
const scaleModeSelect = document.getElementById('scale-mode-select');
if (scaleModeSelect) {
  scaleModeSelect.addEventListener('change', (e) => {
    scaleMode = e.target.value;
    updateKeysForOctave(currentOctave);
  });
}

function noteToFreq(semitone) {
  // A4 = 440Hz, MIDI 69
  return 440 * Math.pow(2, (semitone - 57) / 12);
}

function updateKeysForOctave(octave) {
  let notes;
  if (scaleMode === 'chromatic') {
    // 10 consecutive chromatic notes from C
    notes = [];
    let start = 0; // C
    for (let i = 0; i < 10; i++) {
      const idx = (start + i) % 12;
      const octShift = Math.floor((start + i) / 12);
      notes.push({
        note: chromaticNotes[idx].note,
        semitone: chromaticNotes[idx].semitone + 12 * octShift
      });
    }
  } else {
    notes = baseNotes;
  }
  KEYS.forEach((k, i) => {
    const midi = 12 * octave + notes[i].semitone;
    k.freq = noteToFreq(midi);
    k.note = notes[i].note + (octave + (notes[i].semitone >= 12 ? 1 : 0));
  });
  // Update labels
  document.querySelectorAll('.key-label').forEach((label, i) => {
    label.innerHTML = `<span>${KEYS[i].note}</span><span style='font-size:0.7em;opacity:0.7;'>${KEYS[i].key}</span>`;
  });
  // Update display
  const octaveDisplay = document.getElementById('octave-display');
  if (octaveDisplay) octaveDisplay.textContent = `Octave: ${octave}`;
}

// Octave buttons
const octaveUp = document.getElementById('octave-up');
const octaveDown = document.getElementById('octave-down');
if (octaveUp && octaveDown) {
  octaveUp.addEventListener('click', e => {
    e.stopPropagation();
    if (currentOctave < 7) {
      currentOctave++;
      updateKeysForOctave(currentOctave);
    }
  });
  octaveDown.addEventListener('click', e => {
    e.stopPropagation();
    if (currentOctave > 1) {
      currentOctave--;
      updateKeysForOctave(currentOctave);
    }
  });
}

updateKeysForOctave(currentOctave);

// Render keys
KEYS.forEach(k => keyboard.appendChild(createKey(k)));

// Mouse events
Array.from(keyboard.children).forEach((el, idx) => {
  el.addEventListener('mousedown', () => {
    activateKey(KEYS[idx].key);
  });
  el.addEventListener('mouseup', () => {
    deactivateKey(KEYS[idx].key);
  });
  el.addEventListener('mouseleave', () => {
    deactivateKey(KEYS[idx].key);
  });
  el.addEventListener('touchstart', e => {
    e.preventDefault();
    activateKey(KEYS[idx].key);
  });
  el.addEventListener('touchend', e => {
    e.preventDefault();
    deactivateKey(KEYS[idx].key);
  });
});

// --- Mobile multi-touch support ---
// Track which keys are active for each touch
const touchKeyMap = new Map();

keyboard.addEventListener('touchstart', function(e) {
  e.preventDefault();
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.classList.contains('key')) {
      const key = target.dataset.key;
      activateKey(key);
      touchKeyMap.set(touch.identifier, key);
    }
  }
}, { passive: false });

keyboard.addEventListener('touchmove', function(e) {
  e.preventDefault();
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];
    const prevKey = touchKeyMap.get(touch.identifier);
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.classList.contains('key')) {
      const key = target.dataset.key;
      if (key !== prevKey) {
        if (prevKey) deactivateKey(prevKey);
        activateKey(key);
        touchKeyMap.set(touch.identifier, key);
      }
    } else if (prevKey) {
      deactivateKey(prevKey);
      touchKeyMap.delete(touch.identifier);
    }
  }
}, { passive: false });

keyboard.addEventListener('touchend', function(e) {
  e.preventDefault();
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];
    const key = touchKeyMap.get(touch.identifier);
    if (key) {
      deactivateKey(key);
      touchKeyMap.delete(touch.identifier);
    }
  }
}, { passive: false });

keyboard.addEventListener('touchcancel', function(e) {
  e.preventDefault();
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];
    const key = touchKeyMap.get(touch.identifier);
    if (key) {
      deactivateKey(key);
      touchKeyMap.delete(touch.identifier);
    }
  }
}, { passive: false });

// Track which keys are currently held down to prevent repeat
const heldKeys = new Set();

// Keyboard events (prevent repeat)
window.addEventListener('keydown', e => {
  // Prevent keyboard from triggering when typing in input fields
  const active = document.activeElement;
  if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
  const key = e.key.toUpperCase();
  if (e.repeat || heldKeys.has(key)) return;
  heldKeys.add(key);
  if (KEYS.some(k => k.key === key)) {
    activateKey(key);
  }
});
window.addEventListener('keyup', e => {
  const active = document.activeElement;
  if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
  const key = e.key.toUpperCase();
  heldKeys.delete(key);
  if (KEYS.some(k => k.key === key)) {
    deactivateKey(key);
  }
});

// Settings panel logic
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const hideLabelsCheckbox = document.getElementById('hide-labels-checkbox');

settingsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  settingsPanel.classList.toggle('hidden');
});
settingsPanel.addEventListener('click', (e) => {
  e.stopPropagation();
});
document.addEventListener('click', (e) => {
  if (!settingsPanel.classList.contains('hidden')) {
    settingsPanel.classList.add('hidden');
  }
});
hideLabelsCheckbox.addEventListener('change', (e) => {
  const hide = e.target.checked;
  document.querySelectorAll('.key-label').forEach(label => {
    label.style.visibility = hide ? 'hidden' : 'visible';
  });
});

// --- MIDI Integration ---
async function playMidiFromUrl(midiUrl) {
  try {
    const response = await fetch(midiUrl);
    const arrayBuffer = await response.arrayBuffer();
    const midi = new Midi(arrayBuffer);
    // Flatten all note events from all tracks
    let notes = [];
    midi.tracks.forEach(track => {
      notes = notes.concat(track.notes);
    });
    // Sort by time
    notes.sort((a, b) => a.time - b.time);
    // Map MIDI note names to your keyboard keys (C4 = Q, D4 = W, ...)
    const noteToKey = {
      'C4': 'Q', 'D4': 'W', 'E4': 'E', 'F4': 'R', 'G4': 'T',
      'A4': 'Y', 'B4': 'U', 'C5': 'I', 'D5': 'O', 'E5': 'P'
    };
    let lastTime = 0;
    for (const note of notes) {
      const key = noteToKey[note.name];
      const wait = (note.time - lastTime) * 1000 / midi.header.tempos[0].bpm * 60;
      if (key) {
        await new Promise(res => setTimeout(res, wait));
        activateKey(key);
        await new Promise(res => setTimeout(res, note.duration * 1000));
        deactivateKey(key);
      }
      lastTime = note.time;
    }
  } catch (e) {
    alert('Failed to load or play MIDI: ' + e);
  }
}
// Example usage: playMidiFromUrl('https://bitmidi.com/uploads/123.mid');

// --- End of MIDI Integration ---
// --- Theme/Color Customizer ---
const themeSelect = document.getElementById('theme-select');
const customColorsDiv = document.getElementById('custom-colors');
const perKeyColorsDiv = document.getElementById('per-key-colors');
const bgGradientStart = document.getElementById('bg-gradient-start');
const bgGradientEnd = document.getElementById('bg-gradient-end');

const presetThemes = {
  classic: {
    bg: ['#222244', '#444488'],
    keys: [
      '#00ffff','#ff00ff','#ffff00','#ff8000','#00ff80',
      '#8000ff','#0080ff','#ff0080','#80ff00','#00ff40'
    ]
  },
  dark: {
    bg: ['#181818', '#232323'],
    keys: Array(10).fill('#333')
  },
  neon: {
    bg: ['#0f2027', '#2c5364'],
    keys: [
      '#39ff14','#f72585','#fee440','#ff006e','#00f2ea',
      '#8338ec','#3a86ff','#ffbe0b','#fb5607','#ff006e'
    ]
  },
  rainbow: {
    bg: ['#ff0080', '#7928ca'],
    keys: [
      '#ff0080','#ff8c00','#faff00','#00ff00','#00cfff',
      '#3300ff','#8f00ff','#ff00c8','#ffb300','#00ffb3'
    ]
  }
};

function applyTheme(theme) {
  let t = presetThemes[theme];
  if (t) {
    document.body.style.background = `linear-gradient(135deg, ${t.bg[0]}, ${t.bg[1]})`;
    Array.from(keyboard.children).forEach((el, i) => {
      el.style.background = t.keys[i];
    });
    customColorsDiv.style.display = 'none';
  } else if (theme === 'custom') {
    document.body.style.background = `linear-gradient(135deg, ${bgGradientStart.value}, ${bgGradientEnd.value})`;
    Array.from(keyboard.children).forEach((el, i) => {
      const colorInput = document.getElementById(`key-color-${i}`);
      el.style.background = colorInput.value;
    });
    customColorsDiv.style.display = '';
  }
}

themeSelect.addEventListener('change', e => {
  if (e.target.value === 'custom') {
    customColorsDiv.style.display = '';
    applyTheme('custom');
  } else {
    applyTheme(e.target.value);
  }
});

bgGradientStart.addEventListener('input', () => applyTheme('custom'));
bgGradientEnd.addEventListener('input', () => applyTheme('custom'));

// Create per-key color pickers
function setupPerKeyColorPickers() {
  perKeyColorsDiv.innerHTML = '';
  KEYS.forEach((k, i) => {
    const input = document.createElement('input');
    input.type = 'color';
    input.id = `key-color-${i}`;
    input.value = rgbToHex(k.color);
    input.title = k.note + ' (' + k.key + ')';
    input.addEventListener('input', () => applyTheme('custom'));
    perKeyColorsDiv.appendChild(input);
  });
}
function rgbToHex(rgb) {
  const [r,g,b] = rgb.split(',').map(Number);
  return '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('');
}
setupPerKeyColorPickers();

// Apply default theme
applyTheme('dark');
// Ensure dropdown matches the default theme
if (themeSelect) themeSelect.value = 'dark';
