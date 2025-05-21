import { useState } from "react";
import Image from "next/image";

export default function HowToPlay() {
const slides = [
    {
        title: "Welcome to CrossKnots!",
        content: "CrossKnots is a unique puzzle game inspired by the mathematics of knots. Each level presents a knot diagram, and your challenge is to manipulate it by toggling crossings. Whether you’re a puzzle enthusiast or new to knot theory, you’ll find fun and challenge here!",
    },
    {
        title: "Objective",
        content: "Your goal is to transform the given knot into the 'unknot'—a simple loop with no crossings—or another target configuration. This is done by toggling certain tiles, which represent crossings in the knot. Each move changes the structure of the knot, so plan carefully!",
    },
    {
        title: "How to Play",
        content: "Click on the crossing tiles to toggle them between two states. Below is a sample tile you can interact with.",
        showTiles: true,
    },
    {
        title: "Winning the Game",
        content: "To win a level, you must reach the unknot. Use logic, observation, and a bit of experimentation to find the most efficient solution.",
    },
    {
        title: "Good Luck!",
        content: "Remember: there are often multiple ways to solve a puzzle, and the unknot can appear in many forms. As you progress, levels will become more challenging and introduce new mathematical ideas. Have fun and happy untangling!",
    },
];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [tileState, setTileState] = useState(9); // State for the interactive tile

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const handlePrevious = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const toggleTile = () => {
        setTileState((prev) => (prev === 9 ? 10 : 9)); // Toggle between 9 and 10
    };

    return (
        <div className="flex flex-col justify-center items-center font-display text-3xl bg-caramel p-6 rounded-lg shadow-lg w-full max-w-lg h-full  overflow-hidden">
            <h2 className="text-4xl font-bold mb-4 text-center">{slides[currentSlide].title}</h2>
            <p className="text-3xl text-center mb-6">{slides[currentSlide].content}</p>

            {/* Show interactive tiles only on the "How to Play" slide */}
            {slides[currentSlide].showTiles && (
                <div className="flex justify-center items-center gap-4 mb-6">
                    <div
                        className="w-20 cursor-pointer hover:bg-gray-200"
                        onClick={toggleTile}
                    >
                        <Image
                            src={`/tiles/T${tileState}.png`}
                            alt={`Tile ${tileState}`}
                            width={64}
                            height={64}
                            className="w-full h-full object-contain bg-white"
                        />
                    </div>
                    <p className="text-lg text-center">Click the tile to toggle!</p>
                </div>
            )}

            <div className="flex justify-between w-full max-w-md mt-auto">
                <button
                    onClick={handlePrevious}
                    disabled={currentSlide === 0}
                    className={`px-4 py-2 bg-gray-500 text-white rounded-md ${
                        currentSlide === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600"
                    }`}
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentSlide === slides.length - 1}
                    className={`px-4 py-2 bg-green-600 text-white rounded-md ${
                        currentSlide === slides.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
                    }`}
                >
                    Next
                </button>
            </div>
            <div className="mt-4 text-sm text-gray-700">
                Slide {currentSlide + 1} of {slides.length}
            </div>
        </div>
    );
}