'use client';

import { useEffect } from 'react';

export default function MusicPlayer() {
  useEffect(() => {
    let ctx = new (window.AudioContext || window.webkitAudioContext)();
    let source;
    let gainNode = ctx.createGain();
    gainNode.gain.value = 0.3; 
    gainNode.connect(ctx.destination);
    let isPlaying = true;

    fetch('/sound/Whetzel (Rest This Day Geamat Remix).wav')
      .then(res => res.arrayBuffer())
      .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        if (!isPlaying) return;
        source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        source.connect(gainNode);
        source.start(0);
      });

    return () => {
      isPlaying = false;
      if (source) source.stop();
      ctx.close();
    };
  }, []);

  return null;
}