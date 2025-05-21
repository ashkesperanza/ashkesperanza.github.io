import { useState } from "react";

export default function About() {
const slides = [
    {
        title: "About CrossKnots",
        content: "CrossKnots is a puzzle game inspired by the mathematical beauty of knots. Each puzzle is based on real mathematical knot theory, challenging you to untangle or configure knots by toggling tiles. The game blends logic, spatial reasoning, and a touch of art.",
    },
    {
        title: "The Inspiration",
        content: "In mathematics, knot theory explores how knots can be manipulated and classified. CrossKnots brings these abstract concepts to life, letting you interact with knot diagrams and discover their secrets through play.",
    },
    {
        title: "How It Works",
        content: "Each level presents a grid representing a knot diagram. Some tiles are crossings, which you can toggle to change the knot's structure. Your goal is to reach the unknot using as few moves as possible.",
    },
    {
        title: "Who Made This?",
        content: "CrossKnots was developed by Hannah Scego and Ashley Esperanza, with guidance from Dr. Allison Henrich. Rest This Day (Geamat Remix) is courtesy of James Whetzel.",
    },
    {
        title: "Tips & Tricks",
        content: "Try to spot symmetrical patterns—they often reveal shortcuts. Use the move counter to challenge yourself to find the most efficient solution. Don’t be afraid to experiment—sometimes the solution is simpler than it looks!",
    },
    {
        title: "Thank You!",
        content: "We hope you enjoy playing CrossKnots as much as we enjoyed creating it. Whether you’re a puzzle lover, a math enthusiast, or just curious, there’s something here for you. Good luck, have fun, and happy untangling!",
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
        <div className="flex flex-col justify-center items-center font-display text-3xl bg-caramel p-6 rounded-lg shadow-lg w-full max-w-lg h-full  overflow-hidden">
            <h2 className="text-4xl font-bold mb-4 text-center">{slides[currentSlide].title}</h2>
            <p className="text-3xl text-center mb-6">{slides[currentSlide].content}</p>
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