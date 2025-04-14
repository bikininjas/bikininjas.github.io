import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import ErrorBoundary from './ErrorBoundary';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof document === 'undefined') return;

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [theme, setTheme]);

  return (
    <ErrorBoundary>
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="theme-toggle"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        aria-pressed={theme === 'dark'}
        aria-describedby="theme-shortcut"
      >
        {theme === 'dark' ? '🌞' : '🌙'}
      </button>
      <span id="theme-shortcut" className="sr-only">
        Use Ctrl+T (Cmd+T on Mac) to toggle theme
      </span>
    </ErrorBoundary>
  );
}