import React from 'react';
import { Sun, Moon, Contrast, Type } from 'lucide-react';

export default function AccessibilityBar({
  darkMode,
  setDarkMode,
  highContrast,
  setHighContrast,
  largeText,
  setLargeText,
}) {
  return (
    <div
      aria-label="Accessibility options"
      className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300"
    >
      {/* High Contrast Toggle */}
      <button
        type="button"
        onClick={() => setHighContrast(!highContrast)}
        className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
          highContrast
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-black dark:border-white font-semibold'
            : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
        title="Toggle High Contrast Mode"
        aria-pressed={highContrast}
        aria-label="High contrast mode"
      >
        <Contrast className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Contrast</span>
      </button>

      {/* Large Text Toggle */}
      <button
        type="button"
        onClick={() => setLargeText(!largeText)}
        className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
          largeText
            ? 'bg-teal-600 text-white border-teal-700 font-semibold'
            : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
        title="Toggle Larger Text (Accessibility)"
        aria-pressed={largeText}
        aria-label="Large text size"
      >
        <Type className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Text Size</span>
      </button>

      {/* Dark / Light Mode Toggle */}
      <button
        type="button"
        onClick={() => setDarkMode(!darkMode)}
        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
        title="Toggle Theme"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? (
          <Sun className="w-3.5 h-3.5 text-amber-400" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-slate-700" />
        )}
      </button>
    </div>
  );
}
