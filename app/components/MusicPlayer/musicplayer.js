'use client';

import React, { useEffect, useState } from 'react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Restore playback state if it exists
    if (typeof window !== "undefined" && window.__musicState?.isPlaying) {
      setIsPlaying(true);
    }
  }, []);

  const toggleAudio = async () => {
    if (!window.__musicState) {
      window.__musicState = {
        audioCtx: new (window.AudioContext || window.webkitAudioContext)(),
        source: null,
        gain: null,
        isPlaying: false,
      };
    }

    const ctx = window.__musicState.audioCtx;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (!window.__musicState.isPlaying) {
      const res = await fetch('/sound/Whetzel (Rest This Day Geamat Remix).wav');
      const arrayBuffer = await res.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      const gain = ctx.createGain();
      gain.gain.value = 0.3;
      gain.connect(ctx.destination);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = true;
      source.connect(gain);
      source.start(0);

      window.__musicState.source = source;
      window.__musicState.gain = gain;
      window.__musicState.isPlaying = true;

      setIsPlaying(true);
    } else {
      if (window.__musicState.source) {
        window.__musicState.source.stop();
        window.__musicState.source.disconnect();
        window.__musicState.source = null;
      }
      window.__musicState.isPlaying = false;
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={toggleAudio}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <img
        src={isPlaying ? '/photo/music.png' : '/photo/no music.png'}
        alt={isPlaying ? 'Mute' : 'Unmute'}
        width={80}
        height={40}
      />
    </button>
  );
}
