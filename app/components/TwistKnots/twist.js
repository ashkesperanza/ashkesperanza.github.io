'use client';
import { useState } from "react";
import Image from "next/image";

export default function TwistKnots({ onClose }) {
    const slides = [
        {
            title: "Meet the Twist Knot!",
            content: "A twist knot has a clasp and a row of twists. Each twist is a spot where the rope crosses over itself. Can you spot the clasp and the twists below?",
            grid: [
                [0, 2, 1, 0, 0],
                [2, 7, 10, 1, 0],
                [3, 10, 9, 8, 1],
                [0, 3, 8, 9, 4],
                [0, 0, 3, 4, 0],
            ]
        },
        {
            title: "Try, Flip, Repeat!",
            content: "Don't be afraid to experiment! Try flipping two twists at a time, or undo a move if things get messy. Sometimes, just one more flip is all it takes to set the knot free.",
        },
        {
            title: "Keep Playing!",
            content: "The more you play, the better you'll get at spotting which twists to flip. Every knot is a new puzzle—see how fast you can untangle them all!",
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

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

return (
    <div className="flex flex-col justify-center items-center font-display text-3xl rounded-lg bg-caramel w-full max-w-lg h-full overflow-hidden">
        <div className="p-6 w-full max-w-lg flex flex-col h-[90vh]">
            <h2 className="text-3xl font-bold mb-4 text-center">{slides[currentSlide].title}</h2>
            <p className="text-2xl text-center mb-6 whitespace-pre-line">{slides[currentSlide].content}</p>
            {slides[currentSlide].grid && (
                <div className="flex flex-col items-center mb-4">
                    <div className="border-gray-70 mx-auto">
                        {slides[currentSlide].grid.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex items-center justify-center">
                                {row.map((tile, colIndex) => (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className="w-10 h-10 bg-white"
                                    >
                                        <Image
                                            src={`/tiles/T${tile}.png`}
                                            alt={`T${tile}`}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex-grow" />
            <div>
                <div className="flex justify-between mb-2">
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
                <div className="text-sm text-gray-700 text-center mb-2">
                    Slide {currentSlide + 1} of {slides.length}
                </div>
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors w-full"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
);
}