'use client';
import React from "react";

export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center font-vt323 p-10">
      <div className="bg-white h-150 w-100 lg:w-120 rounded-xl relative max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl font-bold text-gray-700 hover:text-black"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
