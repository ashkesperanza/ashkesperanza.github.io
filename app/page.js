"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AudioPlayer from "./components/AudioPlayer/audio";
import Modal from "./components/Modal/modal";
import About from "./components/About/about";
import HowToPlay from "./components/HowToPlay/howtoplay";

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
      <div>
        <Image
          src="/photo/logo.png"
          alt="Logo"
          width={600}
          height={600}
          className="mx-auto mt-25 max-w-full h-auto md:w-120 lg:w-150 xl:w-200"
        />
        <div className="flex items-center justify-center gap-4 my-10">
          <button onClick={handleHTP}>
            <Image
              src="/photo/howtoplay.png"
              alt="How to Play"
              width={175}
              height={175}
              className="w-full h-full object-contain md:w-50 xl:w-75"
            />
          </button>
          <button onClick={handleAbout}>
            <Image
              src="/photo/about.png"
              alt="About"
              width={175}
              height={175}
              className="w-full h-full object-contain md:w-50 xl:w-75"
            />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 sm:space-y-5 sm:grid-cols-4 p-2">
          {levelOrder.map((level) => (
            <button
              key={level}
              onClick={() => handleLevelClick(level)}
              className="flex justify-center"
            >
              <div className="relative flex justify-center w-24 h-24">
                <Image
                  src={`/levels/${level}.png`}
                  alt={`Level ${level}`}
                  width={100}
                  height={100}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
