"use client";
import { useState } from "react";

export default function SearchBar({ onSubmit, isLoading = false }: { onSubmit: (v:string)=>void, isLoading?: boolean }) {
  const [val, setVal] = useState("");

  return (
    <div className="w-full flex justify-center">
      {/* wrapper that controls final size */}
      <div
        className="flex items-stretch border-2 border-black"
        style={{ width: "clamp(300px, 95vw, 720px)" }}
      >
        <div className="flex items-center pl-4 pr-3 text-gray-500 bg-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="just tell me what you're thinking about and I'll give you the perfect color"
          className="flex-1 h-12 px-2 sm:px-3 outline-none bg-white text-sm border-0 min-w-0 placeholder:text-xs sm:placeholder:text-sm"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSubmit(val);
            }
          }}
        />
        <button
          onClick={() => onSubmit(val)}
          disabled={isLoading}
          className="px-4 sm:px-6 bg-black text-white text-xs sm:text-sm hover:bg-black border-l-2 border-black flex-shrink-0 disabled:opacity-50"
          style={{
            backgroundColor: '#000000',
            color: '#FFFFFF'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#000000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#000000';
          }}
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
}
