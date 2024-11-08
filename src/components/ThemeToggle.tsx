import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ darkMode, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-900'}`}
      aria-label="Cambiar tema"
    >
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}