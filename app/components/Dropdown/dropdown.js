'use client';
import { useState } from "react";
import BackHomeButton from "../BackHome/backhome";
import TwistKnots from "../TwistKnots/twist";
import RationalKnots from "../RationalKnots/rational";
import Modal from "../Modal/modal";

export default function DropdownMenu() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showTwist, setShowTwist] = useState(false);
    const [showRational, setShowRational] = useState(false);
    
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleTwistClick = () => {
        setShowTwist(true);
        setShowDropdown(false); // Close dropdown when tutorial is opened
    };

    const handleRationalClick = () => {
        setShowRational(true);
        setShowDropdown(false); // Close dropdown when tutorial is opened
    }

    return (
        <div className="relative">
            {/* Dropdown Toggle Button */}
            <button
                onClick={toggleDropdown}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 font-vt323 text-4xl"
            >
                Info on Knots
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
                <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-md z-50">
                    <ul className="py-2">
                        <li className="px-4 py-2 hover:bg-gray-100">
                            <button
                                onClick={handleTwistClick}
                                className="font-pixelify text-2xl"
                            >
                                Learn About Twist Knots
                            </button>
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100">
                            <button
                                onClick={handleRationalClick}
                                className="font-pixelify text-2xl"
                            >
                                Learn About Rational Knots
                            </button>
                        </li>
                    </ul>
                </div>
            )}
            {showTwist && (
                <Modal onClose={() => setShowTwist(false)}>
                    <TwistKnots onClose={() => setShowTwist(false)} />
                </Modal>
            )}

            {showRational && (
                <Modal onClose={() => setShowRational(false)}>
                    <RationalKnots onClose={() => setShowRational(false)} />
                </Modal>
            )}
        </div>
    );
}