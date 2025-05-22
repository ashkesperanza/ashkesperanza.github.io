"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AudioPlayer from "./components/AudioPlayer/audio";
import Modal from "./components/Modal/modal";
import About from "./components/About/about";
import HowToPlay from "./components/HowToPlay/howtoplay";
import MusicPlayer from "./components/MusicPlayer/musicplayer";

export default function Home() {
  const router = useRouter();
  const [playSound, setPlaySound] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHTP, setShowHTP] = useState(false);
  const [soundSrc, setSoundSrc] = useState("/sound/button-click.mp3");
  const levelOrder = ["one", "two", "three", "four"];

  const handleAbout = () => {
    setShowAbout((prev) => !prev);
    setShowHTP(false);
    setPlaySound(true);
    setSoundSrc("/sound/button-click.mp3");
  };

  const handleHTP = () => {
    setShowHTP((prev) => !prev);
    setShowAbout(false);
    setPlaySound(true);
    setSoundSrc("/sound/button-click.mp3");
  };

  const handleLevelClick = (level) => {
    router.push(`/level/${level}`);
    setSoundSrc("/sound/button-click.mp3");
    setPlaySound(true);
  };

  return (
    <main className="flex flex-col items-center h-screen w-screen bg-terracotta p-2">
      <MusicPlayer />
      {showAbout && (
        <Modal onClose={() => setShowAbout(false)}>
          <About />
        </Modal>
      )}
      {showHTP && (
        <Modal onClose={() => setShowHTP(false)}>
          <HowToPlay />
        </Modal>
      )}
      <AudioPlayer
        play={playSound}
        src={soundSrc}
        onFinish={() => setPlaySound(false)}
      />
      <div className="flex flex-col">
        <Image
          src="/photo/logo.png"
          alt="Logo"
          width={600}
          height={600}
          className="mx-auto mt-25 h-auto sm:w-130 md:w-150 lg:w-175 xl:w-200"
        />
        <div className="flex items-center justify-center gap-4 my-10 xl:flex-row">
          <button
            onClick={handleHTP}
            className="sm:w-50 md:w-64 xl:w-75" // fixed width and height
          >
            <Image
              src="/photo/howtoplay.png"
              alt="How to Play"
              width={175}
              height={175}
              className="object-contain w-full h-full"
            />
          </button>
          <button
            onClick={handleAbout}
            className="sm:w-50 md:w-64 xl:w-75"
          >
            <Image
              src="/photo/about.png"
              alt="About"
              width={175}
              height={175}
              className="object-contain w-full h-full"
            />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 sm:space-y-5 lg:grid-cols-4 p-2">
          {levelOrder.map((level) => (
            <button
              key={level}
              onClick={() => handleLevelClick(level)}
              className="flex justify-center"
            >
              <div className="relative flex justify-center sm:size-20 md:size-20 lg:size-25">
                <Image
                  src={`/levels/${level}.png`}
                  alt={`Level ${level}`}
                  width={100}
                  height={100}
                  className="object-contain w-full h-full"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
