'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import BackHomeButton from "@/app/components/BackHome/backhome";
import DropdownMenu from "@/app/components/Dropdown/dropdown";
import { useRouter } from "next/navigation";
import "@/app/styles/custom.css"

export default function Three() {
    const router = useRouter();
    const [moves, setMoves] = useState(0);
    const maxMoves = 6;
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [gameWon, setGameWon] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);

    const knotDatabase = [
        {
            name: "8_3",
            grid: [
                [0, 2, 1, 0, 0, 0, 0],
                [2, 10, 8, 1, 0, 0, 0],
                [3, 8, 10, 8, 1, 0, 0],
                [2, 10, 8, 10, 8, 1, 0],
                [3, 9, 8, 9, 7, 4, 0],
                [0, 3, 9, 10, 4, 0, 0],
                [0, 0, 3, 4, 0, 0, 0]
            ],
            tuple: [-1, -1, 1, -1, 1, -1, 1, 1],
            crossings: [10, 10, 10, 10, 9, 9, 9, 10],
            p: 4,
            q: 4,
            pTwistPosition:[
                [1, 1],
                [2, 2],
                [3, 3],
                [4, 3],
            ],
            qTwistPosition: [
                [3, 1],
                [4, 1],
                [5, 2],
                [5, 3],
            ],
        },
        {
            name: "10_1",
            grid: [
                [0, 2, 1, 0, 0, 0, 0],
                [2, 10, 9, 1, 0, 0, 0],
                [3, 9, 8, 9, 1, 0, 0],
                [2, 10, 8, 8, 9, 1, 0],
                [3, 8, 10, 7, 10, 4, 0],
                [0, 3, 9, 10, 4, 0, 0],
                [0, 0, 3, 4, 0, 0, 0],
            ],
            tuple: [1, 1, 1, 1, -1, 1, -1, 1, 1, 1],
            crossings: [10, 9, 9, 9, 10, 9, 10, 10, 9, 10],
            p: 8,
            q: 2,
            pTwistPosition: [
                [1, 1],
                [2, 1],
                [1, 2],
                [2, 3],
                [3, 4],
                [4, 4],
                [5, 2],
                [5, 3],
            ],
            qTwistPosition: [
                [3, 1],
                [4, 2]
            ],
        },
        {
            name: "10_3",
            grid: [
                [0, 2, 1, 0, 0, 0, 0],
                [2, 10, 8, 1, 0, 0, 0],
                [3, 8, 10, 8, 1, 0, 0],
                [2, 7, 9, 7, 9, 1, 0],
                [3, 8, 10, 7, 8, 9, 1],
                [0, 3, 9, 10, 9, 10, 4],
                [0, 0, 3, 4, 3, 4, 0],
            ],
            tuple: [-1, -1, -1, 1, -1, 1, 1, 1, 1, 1],
            crossings: [10, 10, 9, 9, 10, 9, 9, 10, 9, 10],
            p: 6,
            q: 4,
            pTwistPosition: [
                [3, 4],
                [4, 5],
                [5, 2],
                [5, 3],
                [5, 4],
                [5, 5],
            ],
            qTwistPosition: [
                [1, 1],
                [2, 2],
                [3, 2],
                [4, 2],
            ]
        }
    ];

    const [currentKnot, setCurrentKnot] = useState(knotDatabase[currentLevelIndex]);

    useEffect(() => {
        setMoves(0);
        setGameWon(false);
        setCurrentKnot(knotDatabase[currentLevelIndex]);
    }, [currentLevelIndex]);

    const advanceToNextLevel = () => {
        const nextIndex = currentLevelIndex + 1;
        if (nextIndex < knotDatabase.length) {
            setCurrentLevelIndex(nextIndex);
        } else {
            setGameCompleted(true);
            setTimeout(() => {
                router.push("/level/four");
            }, 1800);
        }
    };
    
const verifyKnot = (knotData) => {
    const { tuple, pTwistPosition, qTwistPosition, p, q } = knotData;
    const originalKnot = knotDatabase[currentLevelIndex];

    // 1. Log all crossings in the current grid
    console.log("=== CURRENT GRID CROSSINGS ===");
    const currentCrossings = [];
    for (let row = 0; row < knotData.grid.length; row++) {
        for (let col = 0; col < knotData.grid[row].length; col++) {
            const val = knotData.grid[row][col];
            if (val === 9 || val === 10) {
                console.log(`[${row},${col}] = ${val}`);
                currentCrossings.push({ row, col, val });
            }
        }
    }

    // 2. Log all crossings in the original grid
    console.log("=== ORIGINAL GRID CROSSINGS ===");
    const originalCrossings = [];
    for (let row = 0; row < originalKnot.grid.length; row++) {
        for (let col = 0; col < originalKnot.grid[row].length; col++) {
            const val = originalKnot.grid[row][col];
            if (val === 9 || val === 10) {
                console.log(`[${row},${col}] = ${val}`);
                originalCrossings.push({ row, col, val });
            }
        }
    }

    // 3. Create position-to-index map using ORIGINAL knot
    console.log("=== POSITION TO INDEX MAPPING ===");
    const positionToIndex = {};
    originalCrossings.forEach((crossing, index) => {
        positionToIndex[`${crossing.row},${crossing.col}`] = index;
        console.log(`Mapping: [${crossing.row},${crossing.col}] → index ${index}`);
    });

    // 4. Validate pTwist and qTwist positions
    console.log("=== VALIDATING pTwist POSITIONS ===");
    pTwistPosition.forEach(([row, col], i) => {
        const exists = originalCrossings.some(c => c.row === row && c.col === col);
        if (!exists) {
            console.warn(`⚠️ pTwistPosition[${i}]: [${row},${col}] - MISSING`);
        }
    });
    console.log("=== VALIDATING qTwist POSITIONS ===");
    qTwistPosition.forEach(([row, col], i) => {
        const exists = originalCrossings.some(c => c.row === row && c.col === col);
        if (!exists) {
            console.warn(`⚠️ qTwistPosition[${i}]: [${row},${col}] - MISSING`);
        }
    });

    // 5. Get valid indices and check flips
    const getValidIndices = (positions) => {
        return positions.map(([row, col]) => {
            const index = positionToIndex[`${row},${col}`];
            if (index === undefined) {
                console.warn(`⚠️ Position [${row},${col}] not found in crossings!`);
            }
            return index;
        }).filter(idx => idx !== undefined);
    };

    const qIndices = getValidIndices(qTwistPosition);
    const pIndices = getValidIndices(pTwistPosition);

    console.log("=== TWIST INDICES ===");
    console.log("qTwist indices:", qIndices);
    console.log("pTwist indices:", pIndices);

    // 6. Count flipped crossings with debug info
    const countFlipped = (indices, twistName) => {
        console.log(`=== CHECKING ${twistName} TWISTS ===`);
        return indices.filter(idx => {
            const originalVal = originalKnot.tuple[idx];
            const currentVal = tuple[idx];
            const flipped = originalVal !== currentVal;
            console.log(
                `Index ${idx}: ` +
                `Original ${originalVal} → Current ${currentVal} ` +
                `| ${flipped ? 'FLIPPED' : 'unchanged'}`
            );
            return flipped;
        }).length;
    };

    const qFlipped = countFlipped(qIndices, 'q');
    const pFlipped = countFlipped(pIndices, 'p');

    console.log("=== SUMMARY ===");
    console.log(`qTwist flipped: ${qFlipped}/${qIndices.length}`);
    console.log(`pTwist flipped: ${pFlipped}/${pIndices.length}`);

    // Example: Even/even shortcut logic
    if (q % 2 === 0 && p % 2 === 0) {
        if (qFlipped === qIndices.length / 2) {
            console.log("✅ Half of q-twists flipped - knot is unknotted!");
            setTimeout(() => {
                setGameWon(true);
                setTimeout(advanceToNextLevel, 1500);
            }, 200);
            return;
        }
        if (qFlipped === 0 && pFlipped === pIndices.length / 2) {
            console.log("✅ No q-twist crossings flipped and half of the p-twist crossings have been flipped. The knot is unknotted.");
            setTimeout(() => {
                setGameWon(true);
                setTimeout(advanceToNextLevel, 1500);
            }, 200);
            return;
        }
    }

    // Add more logic for other cases as needed...

    console.log("❌ Knot is still knotted");
};

const toggleTileValue = (rowIndex, colIndex) => {
    if (moves >= maxMoves || gameWon) return;

    const newKnot = JSON.parse(JSON.stringify(currentKnot));
    const grid = newKnot.grid;
    const currentValue = grid[rowIndex][colIndex];

    if (currentValue !== 9 && currentValue !== 10) return;

    // Toggle the tile value
    grid[rowIndex][colIndex] = currentValue === 9 ? 10 : 9;

    // Create position-to-index map from ORIGINAL knot
    const originalKnot = knotDatabase[currentLevelIndex];
    const positionToIndex = {};
    let crossingIndex = 0;
    for (let row = 0; row < originalKnot.grid.length; row++) {
        for (let col = 0; col < originalKnot.grid[row].length; col++) {
            if (originalKnot.grid[row][col] === 9 || originalKnot.grid[row][col] === 10) {
                positionToIndex[`${row},${col}`] = crossingIndex;
                crossingIndex++;
            }
        }
    }

    // Update the tuple using the original mapping
    const tupleIndex = positionToIndex[`${rowIndex},${colIndex}`];
    if (tupleIndex !== undefined) {
        newKnot.tuple[tupleIndex] *= -1;
    }

    setMoves(moves + 1);
    setCurrentKnot(newKnot);
    verifyKnot(newKnot);
};

    const resetGame = () => {
        setMoves(0);
        setCurrentKnot(knotDatabase[currentLevelIndex]);
        setGameWon(false);
    };

    return (
        <div className="h-dvh p-6 bg-caramel">
            <div className="flex items-center">
                <BackHomeButton />
                <DropdownMenu />
            </div>
            <h1 className="text-4xl font-bold text-center mb-4 font-vt323">Puzzle {currentKnot.name}</h1>
            <div className="text-3xl mb-6 text-center font-vt323">
                Moves left: <span className="font-semibold font-vt323">{maxMoves - moves}</span>
            </div>
            
            <div className="border-gray-70 mx-auto">
                {currentKnot.grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center justify-center">
                        {row.map((tile, colIndex) => {
                            const isClickable = tile === 9 || tile === 10;
                            return (
                                <div 
                                    key={`${rowIndex}-${colIndex}`} 
                                    className={`w-15 h-15 bg-white ${
                                        isClickable ? 'cursor-pointer hover:bg-gray-200' : ''
                                    } ${gameWon ? 'pointer-events-none' : ''}`}
                                    onClick={() => isClickable && toggleTileValue(rowIndex, colIndex)}
                                >
                                    <Image
                                        src={`/tiles/T${tile}.png`}
                                        alt={`T${tile}`}
                                        width={48}
                                        height={48}
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
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-vt323 text-3xl"
                >
                    Reset Level
                </button>
            </div>
            {gameWon && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="congrats-banner relative">
                    You got the unknot! <br />
                    {currentLevelIndex < knotDatabase.length - 1
                        ? "Level completed! Advancing to next level..."
                        : "Congratulations! You've completed all levels! Moving on to Level 4..."}
                    </div>
                </div>
            )}
        </div>
    );
}