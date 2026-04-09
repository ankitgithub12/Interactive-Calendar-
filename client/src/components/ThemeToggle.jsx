import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { dark, toggleDark } = useTheme();

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleDark}
      className="p-2.5 rounded-full backdrop-blur-sm border border-white/30 text-white hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg"
      style={{ background: 'rgba(0,0,0,0.25)' }}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
    >
      {dark
        ? <Sun className="w-4 h-4" />
        : <Moon className="w-4 h-4" />
      }
    </button>
  );
}
