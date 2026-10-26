'use client';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

// Pill switch shared by the home page and the nav menu
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 focus:outline-none shadow-2xl border-2 ${
        theme === 'dark' ? 'bg-transparent border-white' : 'bg-transparent border-black'
      }`}
      aria-label="Toggle Theme"
    >
      <span
        className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full transition-transform duration-300 shadow-sm ${
          theme === 'dark' ? 'translate-x-0.5 bg-white' : 'translate-x-[34px] bg-black'
        }`}
      >
        {theme === 'dark' ? (
          <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
