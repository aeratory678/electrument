# Electrument

**Electrument** is a minimalist, interactive virtual keyboard web app designed for musical experimentation and education. Play notes using your QWERTY keyboard, customize the instrument and appearance all directly in your browser.

## Features

- **10-Key Virtual Keyboard:** Mapped to QWERTYUIOP (C4–E5 or chromatic, depending on mode)
- **Instrument Selection:** Choose from Piano, Synth, or Organ sounds
- **Scales/Modes:** Switch between Major Scale and Chromatic (all notes)
- **Octave Shifting:** Move keyboard range up or down (Octave: 1–7)
- **Customizable Themes:** Classic, Dark, Neon, Rainbow, and fully Custom (including per-key colors & gradient backgrounds)
- **Label Toggle:** Show/hide note names and letter labels
- **Mobile Support:** Responsive and supports multi-touch for mobile devices
- **Intuitive Settings Panel:** Easy access to all options via a modern floating pane

## How to Use

1. **Clone or Download**
   ```sh
   git clone https://github.com/aeratory678/electrument.git
   ```
   Or download and extract the ZIP.

2. **Open the App**
   - Just open `index.html` in your favorite browser.
   - No build or server required.

3. **Play!**
   - Use your computer keyboard (`QWERTYUIOP`) or click/tap the on-screen keys.
   - Access settings via the ⚙️ icon (top right) to:
     - Toggle note/letter labels
     - Change instrument
     - Switch scale/mode
     - Shift octaves
     - Change theme or customize colors

4. **MIDI Playback (optional)**
   - To play a MIDI file, call `playMidiFromUrl('your-midi-url.mid')` in the browser console, or adapt the code for your needs.

## File Structure

```
index.html    # Main app UI
script.js     # All interactive logic
style.css     # App styling and theming
```

## Customization

- **Themes:** Choose from several built-in color themes or create your own.
- **Per-Key Colors:** In Custom theme, pick colors for each key and set gradient backgrounds.
- **Extensible:** The code is written in plain JavaScript & CSS—easy to modify for new features.

## Dependencies

- [Tone.js MIDI Parser](https://github.com/Tonejs/Midi) (CDN)


Made for creative play, musical learning, and fun!
