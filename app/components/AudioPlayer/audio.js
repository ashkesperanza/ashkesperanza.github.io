'use client';
import React, { useRef, useEffect } from "react";

export default function AudioPlayer({ play, src, onFinish}) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (play) {
      playAudio();
    }
  }, [play]);

  const playAudio = () => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Playback error:", error);
        });
      }
    }
  };

  const handleAudioEnded = () => {
    if (onFinish) {
      onFinish(); // Call the parent function to reset `playSound`
    }
  };

  return (
    <div>
      <audio
        ref={audioRef}
        className="hidden"
        onEnded={handleAudioEnded}
        preload="auto"
        crossOrigin="anonymous"
      >
        <source src={src} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
