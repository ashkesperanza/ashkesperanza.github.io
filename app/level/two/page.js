'use client';
import { useState, useEffect } from "react";
import DropdownMenu from "@/app/components/Dropdown/dropdown";
import Image from "next/image";
import BackHomeButton from "@/app/components/BackHome/backhome";
import { useRouter } from "next/navigation";
import "@/app/styles/custom.css";

export default function Two() {
    const router = useRouter();
    const [moves, setMoves] = useState(0);
    const maxMoves = 5;
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [gameWon, setGameWon] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);

    const knotDatabase = [
        {
            name: "7_2",
            grid: [
                [0, 2, 1, 0, 0, 0],
                [2, 10, 8, 1, 0, 0],
                [3, 8, 10, 9, 1, 0],
                [0, 3, 9, 8, 9, 1],
                [0, 0, 3, 9, 10, 4],
                [0, 0, 0, 3, 4, 0],
            ],
            tuple: [1, 1, 1, 1, 1, 1, 1],
            crossings: [
                [1, 1],
                [2, 2],
                [2, 3],
                [3, 4],
                [4, 4],
                [4, 3],
                [3, 2],
            ],
            claspPosition: [
                [1, 1],
                [2, 2],
            ],
            twistPosition: [
                [2, 3],
                [3, 4],
                [4, 4],
                [4, 3],
                [3, 2],
            ]
        },
        {
            name: "8_1",
            grid: [
                [0, 0, 2, 1, 0, 0],
                [0, 2, 10, 8, 1, 0],
                [2, 10, 8, 10, 9, 1],
                [3, 9, 8, 7, 10, 4],
                [0, 3, 9, 10, 4, 0],
                [0, 0, 3, 4, 0, 0],
            ],
            tuple: [-1, 1, -1, 1, 1, 1, 1, 1],
            crossings: [
                [1, 2],
                [2, 1],
                [2, 3],
                [2, 4],
                [3, 1],
                [3, 4],
                [4, 2],
                [4, 3],
            ],
            claspPosition: [
                [1, 2],
                [2, 3],
            ],
            twistPosition: [
                [2, 1],
                [2, 4],
                [3, 1],
                [3, 4],
                [4, 2],
                [4, 3],
            ],
        },
        {
            name: "9_2",
            grid: [
                [0, 2, 1, 2, 1, 0],
                [2, 9, 10, 9, 10, 1],
                [3, 10, 8, 7, 9, 4],
                [0, 3, 10, 9, 8, 1],
                [0, 0, 3, 8, 9, 4],
                [0, 0, 0, 3, 4, 0],
            ],
            tuple: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            crossings:[
                [1, 1],
                [1, 2],
                [1, 3],
                [1, 4],
                [2, 1],
                [2, 4],
                [3, 2],
                [3, 3],
                [4, 4],
            ],
            claspPosition: [
                [3, 3],
                [4, 4],
            ],
            twistPosition: [
                [1, 1],
                [1, 2],
                [1, 3],
                [1, 4],
                [2, 1],
                [2, 4],
                [3, 2],
            ],
        },
    ];

    const [currentKnot, setCurrentKnot] = useState(knotDatabase[currentLevelIndex]);
 
      useEffect(() => {
        setMoves(0);
        setGameWon(false);
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
                router.push("/level/three");
            }, 1800);
         }
     };
 
const verifyKnot = (knotData) => {
    const { tuple, crossings, claspPosition, twistPosition } = knotData;
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

    // 4. Validate twist and clasp positions
    console.log("=== VALIDATING twist POSITIONS ===");
    twistPosition?.forEach?.(([row, col], i) => {
        const exists = originalCrossings.some(c => c.row === row && c.col === col);
        if (!exists) {
            console.warn(`⚠️ twistPosition[${i}]: [${row},${col}] - MISSING`);
        }
    });
    console.log("=== VALIDATING clasp POSITIONS ===");
    claspPosition?.forEach?.(([row, col], i) => {
        const exists = originalCrossings.some(c => c.row === row && c.col === col);
        if (!exists) {
            console.warn(`⚠️ claspPosition[${i}]: [${row},${col}] - MISSING`);
        }
    });

    // 5. Get valid indices
    const getValidIndices = (positions) => {
        if (!positions) return [];
        return positions.map(([row, col]) => {
            const index = positionToIndex[`${row},${col}`];
            if (index === undefined) {
                console.warn(`⚠️ Position [${row},${col}] not found in crossings!`);
            }
            return index;
        }).filter(idx => idx !== undefined);
    };

    const twistIndices = getValidIndices(twistPosition);
    const claspIndices = getValidIndices(claspPosition);

    console.log("=== TWIST INDICES ===");
    console.log("twist indices:", twistIndices);
    console.log("clasp indices:", claspIndices);

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

    const twistFlipped = countFlipped(twistIndices, 'twist');

    // 7. Compute sums
    const twistSum = twistIndices.reduce((sum, idx) => sum + tuple[idx], 0);
    const claspSum = claspIndices.reduce((sum, idx) => sum + tuple[idx], 0);

    console.log("Flipped Count:", twistFlipped);
    console.log("Twist Sum:", twistSum);
    console.log("Clasp Sum:", claspSum);

    // 8. Unknot logic (your original)
    if (
        twistIndices.length % 2 === 0 &&
        twistFlipped === twistIndices.length / 2 &&
        twistSum === 0
    ) {
        console.log("Half of the twist crossings have been flipped and sum is zero. It's the unknot!");
        setTimeout(() => {
            setGameWon(true);
            setTimeout(advanceToNextLevel, 1500);
        }, 100);
        return;
    }

    if (claspSum === 0) {
        console.log("It's the unknot (claspSum = 0).");
        setTimeout(() => {
            setGameWon(true);
            setTimeout(advanceToNextLevel, 1500);
        }, 100);
        return;
    }

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
        // Deep clone again to reset tuple
        const knot = JSON.parse(JSON.stringify(knotDatabase[currentLevelIndex]));
        setCurrentKnot(knot);
        setGameWon(false);
    };
 
     return (
         <div className="h-dvh p-2 bg-caramel">
            <div className="flex flex-row items-center">
                <BackHomeButton />
                <DropdownMenu />
            </div>
             <h1 className="text-4xl font-bold text-center mb-4 font-vt323">Knot Game - Level {currentKnot.name}</h1>
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
                        ? "Level completed! Advancing to next puzzle..."
                        : "Congratulations! You've completed all levels! Heading to Level 3..."}
                    </div>
                </div>
            )}
         </div>
     );
 }