import { useCallback, useRef, useState } from 'react';

export function useSound() {
  const audioCtxRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // FAAAH explosion sound — layered low thud + high crack + reverb
  const playExplosion = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Low frequency thud
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.type = 'sawtooth';
    thudOsc.frequency.setValueAtTime(80, now);
    thudOsc.frequency.exponentialRampToValueAtTime(20, now + 0.5);
    thudGain.gain.setValueAtTime(0.8, now);
    thudGain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    thudOsc.connect(thudGain);
    thudGain.connect(ctx.destination);
    thudOsc.start(now);
    thudOsc.stop(now + 0.6);

    // High frequency crack
    const crackOsc = ctx.createOscillator();
    const crackGain = ctx.createGain();
    const crackFilter = ctx.createBiquadFilter();
    crackOsc.type = 'square';
    crackOsc.frequency.setValueAtTime(2000, now);
    crackOsc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
    crackFilter.type = 'highpass';
    crackFilter.frequency.value = 500;
    crackGain.gain.setValueAtTime(0.5, now);
    crackGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    crackOsc.connect(crackFilter);
    crackFilter.connect(crackGain);
    crackGain.connect(ctx.destination);
    crackOsc.start(now);
    crackOsc.stop(now + 0.2);

    // Noise burst for texture
    const bufferSize = ctx.sampleRate * 0.4;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.1));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 3000;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    // Reverb tail via delayed echoes
    for (let i = 1; i <= 4; i++) {
      const echoOsc = ctx.createOscillator();
      const echoGain = ctx.createGain();
      echoOsc.type = 'sine';
      echoOsc.frequency.setValueAtTime(40 + i * 10, now + i * 0.08);
      echoOsc.frequency.exponentialRampToValueAtTime(15, now + i * 0.08 + 0.3);
      echoGain.gain.setValueAtTime(0.3 / i, now + i * 0.08);
      echoGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
      echoOsc.connect(echoGain);
      echoGain.connect(ctx.destination);
      echoOsc.start(now + i * 0.08);
      echoOsc.stop(now + i * 0.08 + 0.3);
    }
  }, [soundEnabled, getCtx]);

  // Bubble/fizz sound
  const playBubble = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getCtx();
    const now = ctx.currentTime;

    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const freq = 800 + Math.random() * 2000;
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + i * 0.06 + 0.08);
      gain.gain.setValueAtTime(0.15, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.1);
    }
  }, [soundEnabled, getCtx]);

  // Success chime — ascending tones
  const playSuccess = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getCtx();
    const now = ctx.currentTime;
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.3);
    });
  }, [soundEnabled, getCtx]);

  // Error buzz / FAAAH sound — descending tones
  const playFaah = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1, now);
    osc.frequency.exponentialRampToValueAtTime(0, now + 0.6); // descending "faaaah"

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
  }, [soundEnabled, getCtx]);

  const playError = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }, [soundEnabled, getCtx]);

  // Drag/drop click
  const playClick = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 1200;
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }, [soundEnabled, getCtx]);

  // Pour/mix sound
  const playPour = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getCtx();
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.3;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2000;
    filter.Q.value = 2;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(now);
  }, [soundEnabled, getCtx]);

  return {
    soundEnabled,
    setSoundEnabled,
    playExplosion,
    playBubble,
    playSuccess,
    playError,
    playClick,
    playPour,
    playFaah
  };
}

export default useSound;
