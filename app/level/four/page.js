'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import BackHomeButton from "@/app/components/BackHome/backhome";
import DropdownMenu from "@/app/components/Dropdown/dropdown";
import "@/app/styles/custom.css"
import { useRouter } from "next/navigation";

export default function Four() {
    const router = useRouter();
    const [moves, setMoves] = useState(0);
    const maxMoves = 6;
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [gameWon, setGameWon] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);

    const knotDatabase = [
                {
            name: "7_3",
            grid: [
                [0, 0, 2, 1, 0, 0],
                [0, 2, 10, 8, 1, 0],
                [2, 10, 8, 10, 8, 1],
                [3, 9, 8, 9, 7, 4],
                [0, 3, 9, 10, 4, 0],
                [0, 0, 3, 4, 0, 0],
            ],
            tuple: [-1, -1, -1, -1, -1, -1, -1, -1],
            crossings: [10, 10, 10, 9, 9, 9, 10],
            p: 4,
            q: 3,
            pTwistPosition: [
                [2, 1],
                [3, 1],
                [4, 2],
                [4, 3],
            ],
            qTwistPosition: [
                [1, 2],
                [2, 3],
                [3, 3]
            ],
        },
        {
            name: "9_3",
            grid: [
                [0, 2, 1, 0, 0, 0, 0],
                [2, 10, 8, 1, 0, 0, 0],
                [3, 8, 10, 8, 1, 0, 0],
                [2, 10, 8, 10, 9, 1, 0],
                [3, 9, 8, 7, 10, 4, 0],
                [0, 3, 9, 10, 4, 0, 0],
                [0, 0, 3, 4, 0, 0, 0],
            ],
            tuple: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            crossings: [10, 10, 10, 10, 9, 9, 10, 9, 10],
            p: 6,
            q: 3,
            pTwistPosition: [
                [3, 1],
                [3, 4],
                [4, 1],
                [4, 4],
                [5, 2],
                [5, 3],
            ],
            qTwistPosition: [
                [1, 1],
                [2, 2],
                [3, 3],
            ],
        },
        {
            name: "9_4",
            grid: [
                [0, 0, 2, 1, 0, 0, 0],
                [0, 2, 10, 8, 1, 0, 0],
                [2, 10, 8, 10, 8, 1, 0],
                [3, 9, 8, 8, 10, 8, 1],
                [0, 3, 9, 8, 9, 7, 4],
                [0, 0, 3, 9, 10, 4, 0],
                [0, 0, 0, 3, 4, 0, 0],
            ],
            tuple: [1, 1, 1, 1, 1, 1, 1, 1, 1],
            crossings: [10, 10, 10, 9, 10, 9, 9, 9, 10],
            p: 6,
            q: 3,
            pTwistPosition: [
                [2, 1],
                [3, 1],
                [4, 2],
                [4, 4],
                [5, 3],
                [5, 4],
            ],
            qTwistPosition: [
                [1, 2],
                [2, 3],
                [3, 4],
            ],
        },
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
                router.push("/");
            }, 1800);
        }
    };

    const getValidIndices = (positions, positionToIndex, tupleLength) => {
        if (!positions) return [];
        return positions.map(([row, col]) => {
            const index = positionToIndex?.[`${row},${col}`];
            if (index === undefined) {
                console.warn(`⚠️ Position [${row},${col}] not found in crossings!`);
            }
            return index;
        }).filter(idx => idx !== undefined && idx < tupleLength);
    };

const verifyKnot = (knotData) => {
    const { tuple, pTwistPosition, qTwistPosition, p, q } = knotData;
    const originalKnot = knotDatabase[currentLevelIndex];

    console.log("=== VERIFYING KNOT ALGORITHM ===");

    // Build position-to-index map using ORIGINAL knot
    const originalCrossings = [];
    for (let row = 0; row < originalKnot.grid.length; row++) {
        for (let col = 0; col < originalKnot.grid[row].length; col++) {
            const val = originalKnot.grid[row][col];
            if (val === 9 || val === 10) {
                originalCrossings.push({ row, col, val });
            }
        }
    }

    const positionToIndex = {};
    originalCrossings.forEach((crossing, index) => {
        positionToIndex[`${crossing.row},${crossing.col}`] = index;
    });

    // Get indices for p-twist and q-twist positions
    const qIndices = getValidIndices(qTwistPosition, positionToIndex, tuple.length);
    const pIndices = getValidIndices(pTwistPosition, positionToIndex, tuple.length);

    console.log("qTwist indices:", qIndices);
    console.log("pTwist indices:", pIndices);

    // Count actual flipped crossings (comparing current vs original)
    const countActualFlipped = (indices, twistName) => {
        console.log(`=== CHECKING ACTUAL ${twistName} FLIPS ===`);
        return indices.filter(idx => {
            if (idx >= tuple.length || idx >= originalKnot.tuple.length) {
                console.warn(`⚠️ Index ${idx} out of bounds for tuple`);
                return false;
            }
            const originalVal = originalKnot.tuple[idx];
            const currentVal = tuple[idx];
            const flipped = originalVal !== currentVal;
            console.log(`Index ${idx}: original=${originalVal}, current=${currentVal}, flipped=${flipped}`);
            return flipped; 
        }).length;
    };

    const qFlipped = countActualFlipped(qIndices, 'q');
    const pFlipped = countActualFlipped(pIndices, 'p');

    console.log("=== ACTUAL FLIPS SUMMARY ===");
    console.log(`qTwist flipped: ${qFlipped}/${qIndices.length}`);
    console.log(`pTwist flipped: ${pFlipped}/${pIndices.length}`);

    // Get current signs for writhe calculation
    const qSigns = qIndices.map(idx => tuple[idx]);
    const pSigns = pIndices.map(idx => tuple[idx]);

    // Case 1: Both p and q are even (existing logic works fine)
    if (q % 2 === 0 && p % 2 === 0) {
        console.log("=== CASE 1: p even, q even ===");
        if (qFlipped === qIndices.length / 2) {
            console.log("✅ Half of q-twists flipped - knot is unknotted!");
            setTimeout(() => {
                setGameWon(true);
                setTimeout(advanceToNextLevel, 1500);
            }, 100);
            return;
        }
        if (qFlipped === 0 && pFlipped === pIndices.length / 2) {
            console.log("✅ No q-twist crossings flipped and half of the p-twist crossings have been flipped. The knot is unknotted.");
            setTimeout(() => {
                setGameWon(true);
                setTimeout(advanceToNextLevel, 1500);
            }, 100); 
            return;
        }
    }

    // Case 2: p even, q odd - PROPER ALGORITHM IMPLEMENTATION
    if (p % 2 === 0 && q % 2 === 1) {
        console.log("=== CASE 2: p even, q odd ===");
        
        // NEW: Check for alternative unknotting method - half p-crossings flipped, q untouched
        if (pFlipped === pIndices.length / 2 && qFlipped === 0) {
            console.log("✅ Alternative unknotting method: Half p-crossings flipped, q-twist untouched");
            console.log(`pFlipped: ${pFlipped}/${pIndices.length}, qFlipped: ${qFlipped}/${qIndices.length}`);
            setTimeout(() => {
                setGameWon(true);
                setTimeout(advanceToNextLevel, 1500);
            }, 100);
            return;
        }
        
        // STEP 1: Check if q-twist was properly reduced to 1 crossing
        console.log("STEP 1: Checking q-twist reduction...");
        
        let qReductionValid = false;
        let reducedQSign = 0;
        
        // Method A: Change (q-1)/2 crossings to leave one crossing unchanged
        const methodA_flipsNeeded = Math.floor((q - 1) / 2);
        if (qFlipped === methodA_flipsNeeded) {
            console.log(`Method A: ${qFlipped} q-crossings flipped (expected ${methodA_flipsNeeded})`);
            // The remaining crossing sign is the last one (or first unchanged one)
            reducedQSign = qSigns[qSigns.length - 1]; // Use last crossing as remaining
            qReductionValid = true;
            console.log(`Reduced q-twist sign: ${reducedQSign}`);
        }
        
        // Method B: Change (q+1)/2 crossings to invert the sign of the last crossing
        const methodB_flipsNeeded = Math.floor((q + 1) / 2);
        if (!qReductionValid && qFlipped === methodB_flipsNeeded) {
            console.log(`Method B: ${qFlipped} q-crossings flipped (expected ${methodB_flipsNeeded})`);
            // In this method, we've effectively inverted the last crossing
            reducedQSign = -qSigns[qSigns.length - 1]; // Inverted last crossing
            qReductionValid = true;
            console.log(`Reduced q-twist sign (inverted): ${reducedQSign}`);
        }
        
        if (!qReductionValid) {
            console.log(`❌ q-twist reduction invalid. Flipped: ${qFlipped}, Expected: ${methodA_flipsNeeded} or ${methodB_flipsNeeded}`);
            return;
        }
        
        // STEP 2: Calculate total writhe
        console.log("STEP 2: Calculating total writhe...");
        const pSum = pSigns.reduce((a, b) => a + b, 0);
        const W = pSum + reducedQSign;
        console.log(`pSum: ${pSum}, reducedQSign: ${reducedQSign}, Total writhe W: ${W}`);
        
        // STEP 3: Check if p-twist was adjusted to achieve W = ±1
        console.log("STEP 3: Checking p-twist adjustment...");
        
        if (Math.abs(W) === 1) {
            console.log("✅ Total writhe is ±1 - knot is unknotted!");
            setTimeout(() => {
                setGameWon(true);
                setTimeout(advanceToNextLevel, 1500);
            }, 100);
            return;
        } else {
            console.log(`❌ Total writhe is ${W}, not ±1. Need to adjust p-twist crossings.`);
            
            // Check if player can still make moves to fix this
            if (moves < maxMoves) {
                console.log(`Player has ${maxMoves - moves} moves left to adjust p-twist.`);
            }
            return;
        }
    }

    // Case 3: p odd, q even - Add this case if needed
    if (p % 2 === 1 && q % 2 === 0) {
        console.log("=== CASE 3: p odd, q even ===");
        // Similar logic to Case 2 but with roles reversed
        // Implementation depends on your specific algorithm for this case
        console.log("This case not fully implemented yet.");
        return;
    }

    // Case 4: Both p and q are odd
    if (p % 2 === 1 && q % 2 === 1) {
        console.log("=== CASE 4: p odd, q odd ===");
        // Implementation depends on your specific algorithm for this case
        console.log("This case not fully implemented yet.");
        return;
    }

    console.log("❌ Knot is still knotted or case not handled");
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

    // Update tuple - find the correct crossing index
    const originalKnot = knotDatabase[currentLevelIndex];
    const originalCrossings = [];
    for (let row = 0; row < originalKnot.grid.length; row++) {
        for (let col = 0; col < originalKnot.grid[row].length; col++) {
            const val = originalKnot.grid[row][col];
            if (val === 9 || val === 10) {
                originalCrossings.push({ row, col, val });
            }
        }
    }

    // Find which crossing index corresponds to the clicked position
    const clickedCrossingIndex = originalCrossings.findIndex(crossing => 
        crossing.row === rowIndex && crossing.col === colIndex
    );

    if (clickedCrossingIndex !== -1 && clickedCrossingIndex < newKnot.tuple.length) {
        // Toggle the corresponding tuple value
        newKnot.tuple[clickedCrossingIndex] *= -1;
        console.log(`Toggled crossing at [${rowIndex},${colIndex}] (index ${clickedCrossingIndex}): ${newKnot.tuple[clickedCrossingIndex]}`);
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
            <div className="flex flex-row items-center">
                <BackHomeButton />
                <DropdownMenu />
            </div>
            <h1 className="text-4xl font-bold text-center mb-4 font-vt323">Puzzle: {currentKnot.name}</h1>
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
                                    className={`bg-white sm:size-15 md:size-18 lg:size-20 ${
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
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-display text-3xl font-vt323"
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
                    : "Congratulations! You've completed all levels of CrossKnots!"}
                </div>
            </div>
        )}
        </div>
    );
}
