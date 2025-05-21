'use client';

import React, { useState, useRef } from 'react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);

  const startAudio = () => {
    if (isPlaying) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    fetch('/sound/Whetzel (Rest This Day Geamat Remix).wav')
      .then(res => res.arrayBuffer())
      .then(arrayBuffer => audioCtxRef.current.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        const gainNode = audioCtxRef.current.createGain();
        gainNode.gain.value = 0.3;
        gainNode.connect(audioCtxRef.current.destination);

        const source = audioCtxRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        source.connect(gainNode);
        source.start(0);

        sourceRef.current = source;
        setIsPlaying(true);
      });
  };

  return (
    <>
      {!isPlaying && (
        <button
          onClick={startAudio}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Unmute Music
        </button>
      )}
    </>
  );
}
