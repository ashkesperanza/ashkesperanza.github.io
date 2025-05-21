'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import BackHomeButton from "@/app/components/BackHome/backhome";
import "@/app/styles/custom.css"
import DropdownMenu from "@/app/components/Dropdown/dropdown";
import { useRouter } from "next/navigation";

export default function One() {
    const router = useRouter();
    const [moves, setMoves] = useState(0);
    const maxMoves = 2;
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [gameWon, setGameWon] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);

    const knotDatabase = [
        {
            name: "4_1",
            grid: [
                [0, 2, 1, 0, 0],
                [2, 7, 10, 1, 0],
                [3, 10, 9, 8, 1],
                [0, 3, 8, 9, 4],
                [0, 0, 3, 4, 0],
            ],
            tuple: [-1, -1, 1, 1],
            crossings: [
                [1, 2],
                [2, 1],
                [2, 2],
                [3, 3],
            ],
            claspPosition: [
                [2, 2],
                [3, 3]
            ],
            twistPosition: [
                [1, 2],
                [2, 1],
            ]
        },
        {
            name: "5_2",
            grid: [
                [0, 2, 1, 0, 0],
                [2, 9, 10, 1, 0],
                [3, 10, 9, 8, 1],
                [0, 3, 8, 9, 4],
                [0, 0, 3, 4, 0],
            ],
            tuple: [-1, -1, -1, -1, -1],
            crossings: [
                [1, 1],
                [1, 2],
                [2, 1],
                [2, 2],
                [3, 3],
            ],
            claspPosition: [
                [2, 2],
                [3, 3],
            ],
            twistPosition: [
                [1, 1],
                [1, 2],
                [2, 1],
            ]
        },
        {
            name: "6_1",
            grid: [
                [0, 2, 1, 0, 0, 0],
                [2, 9, 8, 1, 0, 0],
                [3, 8, 9, 10, 1, 0],
                [0, 3, 8, 8, 10, 1],
                [0, 0, 3, 10, 9, 4],
                [0, 0, 0, 3, 4, 0],
            ],
            tuple: [1, 1, -1, -1, -1, -1],
            crossings: [
                [1, 1],
                [2, 2],
                [2, 3],
                [3, 4],
                [4, 3],
                [4, 4],
            ],
            claspPosition: [
                [1, 1],
                [2, 2],
            ],
            twistPosition: [
                [2, 3],
                [3, 4],
                [4, 3],
                [4, 4],
            ],
        }
    ];

    const [currentKnot, setCurrentKnot] = useState(knotDatabase[currentLevelIndex]);

    useEffect(() => {
        setMoves(0);
        setGameWon(false);
        // Deep clone the knot and its tuple
        const knot = JSON.parse(JSON.stringify(knotDatabase[currentLevelIndex]));
        setCurrentKnot(knot);
    }, [currentLevelIndex]);

    const advanceToNextLevel = () => {
        const nextIndex = currentLevelIndex + 1;
        if (nextIndex < knotDatabase.length) {
            setCurrentLevelIndex(nextIndex);
        } else {
            setGameCompleted(true);
            setTimeout(() => {
                router.push("/level/two");
            }, 1800);
        }
    };

    const verifyKnot = (knotData) => {
    const { tuple, crossings, claspPosition, twistPosition } = knotData;

    // Always copy the original tuple to avoid reference issues
    const originalTuple = [...knotDatabase[currentLevelIndex].tuple]; // This is now always the original, unmutated tuple

    let flippedCount = 0;
    twistPosition.forEach(([row, col]) => {
        const idx = crossings.findIndex(([r, c]) => r === row && c === col);
        if (idx !== -1 && tuple[idx] !== originalTuple[idx]) {
            flippedCount++;
        }
    });
    console.log("Flipped Count:", flippedCount);

    const twistSum = twistPosition.reduce((sum, [row, col]) => {
        const idx = crossings.findIndex(([r, c]) => r === row && c === col);
        return sum + (idx !== -1 ? tuple[idx] : 0);
    }, 0);

    if (
        twistPosition.length % 2 === 0 &&
        flippedCount === twistPosition.length / 2 &&
        twistSum === 0
    ) {
        console.log("Half of the twist crossings have been flipped and sum is zero. It's the unknot!");
        setTimeout(() => {
                setGameWon(true);
                setTimeout(advanceToNextLevel, 1500);
        }, 100); // <-- delay before showing congrats
        return;
    }

    // 2. Sum-based logic (as before)
    const claspSum = claspPosition.reduce((sum, [row, col]) => {
        const index = crossings.findIndex(([r, c]) => r === row && c === col);
        return sum + (index !== -1 ? tuple[index] : 0);
    }, 0);

    console.log("Clasp Sum:", claspSum);

    if (claspSum === 0) {
        console.log("It's the unknot (claspSum = 0).");
        setTimeout(() => {
            setGameWon(true);
            setTimeout(advanceToNextLevel, 1500);
        }, 100); // <-- delay before showing congrats
        return;
    }

    // twistSum already computed above
    console.log("Twist Sum:", twistSum);

    if (Math.abs(twistSum) !== 1) {
        console.log("It's a knot (twistSum ≠ ±1).");
        return;
    }

    const totalSum = claspSum + twistSum;
    console.log("Total Sum:", totalSum);

    if (Math.abs(totalSum) === 3) {
        console.log("It's a knot (totalSum = ±3).");
        return;
    }

    console.log("It's the unknot (totalSum ≠ ±3).");
    setTimeout(() => {
        setGameWon(true);
        setTimeout(advanceToNextLevel, 1500);
    }, 100);
};

    const toggleTileValue = (rowIndex, colIndex) => {
        if (moves >= maxMoves || gameWon) {
            return;
        }
    
        const newKnot = JSON.parse(JSON.stringify(currentKnot));
        const grid = newKnot.grid;
        const currentValue = grid[rowIndex][colIndex];
    
        // Only proceed if tile is 9 or 10
        if (currentValue !== 9 && currentValue !== 10) {
            return;
        }
    
        // Toggle between 9 and 10
        grid[rowIndex][colIndex] = currentValue === 9 ? 10 : 9;
    
        // Update tuple
        if (newKnot.crossings && newKnot.tuple) {
            const crossingIndex = newKnot.crossings.findIndex(
                ([r, c]) => r === rowIndex && c === colIndex
            );
    
            if (crossingIndex !== -1) {
                // Flip the sign of the corresponding tuple value
                newKnot.tuple[crossingIndex] *= -1;
            }
        }
    
        setMoves(moves + 1);
        setCurrentKnot(newKnot);
        verifyKnot(newKnot);
    };

    const resetGame = () => {
        setMoves(0);
        const knot = JSON.parse(JSON.stringify(knotDatabase[currentLevelIndex]));
        setCurrentKnot(knot);
        setGameWon(false);
    };

    return (
        <div className={`h-dvh p-2 bg-caramel transition-all duration-500`}>
            <div className="flex flex-row items-center" >
                <BackHomeButton />
                <DropdownMenu />
            </div>
            <h1 className="text-4xl font-bold text-center mb-4 font-vt323">Puzzle: {currentKnot.name}</h1>
            <div className="text-3xl mb-6 text-center font-vt323">
                Moves left: <span className="font-semibold">{maxMoves - moves}</span>
            </div>
            <div className="border-gray-70 mx-auto">
                {currentKnot.grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center justify-center">
                        {row.map((tile, colIndex) => {
                            const isClickable = tile === 9 || tile === 10;
                            return (
                                <div 
                                    key={`${rowIndex}-${colIndex}`} 
                                    className={`w-18 h-18 bg-white ${
                                        isClickable ? 'cursor-pointer hover:bg-gray-200' : ''
                                    } ${gameWon ? 'pointer-events-none' : ''}`}
                                    onClick={() => isClickable && toggleTileValue(rowIndex, colIndex)}
                                >
                                    <Image
                                        src={`/tiles/T${tile}.png`}
                                        alt={`T${tile}`}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="text-center mt-6">
                <button
                    onClick={resetGame}
                    className="px-6 py-2 bg-green-600 text-white text-3xl rounded-md hover:bg-green-700 transition-colors font-vt323"
                >
                    Reset Level
                </button>
            </div>
            {gameWon && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="congrats-banner relative">
                     You got the unknot! <br />
                    {currentLevelIndex < knotDatabase.length - 1
                        ? "Level completed! Advancing to next puzzle..."
                        : "Congratulations! You've completed all levels! Heading to Level 2..."}
                    </div>
                </div>
            )}
        </div>
    );
}