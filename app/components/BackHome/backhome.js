'use client'
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BackHomeButton() {
    const [playClick, setPlayClick] = useState(false);

    const handleClick = () => {
        setPlayClick(true);
    }

    return (
        <div>
            <Link href="/">
                <button onClick={handleClick} className="m-2">
                    <Image
                        src="/photo/home.png"
                        alt="Home"
                        width={65}
                        height={65}
                    />
                </button>
            </Link>
        </div>
    );
}