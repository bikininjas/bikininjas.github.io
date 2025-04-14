import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import ErrorBoundary from './ErrorBoundary';

export default function Search({ onSearch, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    try {
      onSearch(query.trim());
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="search-container" role="search">
        <form onSubmit={handleSubmit}>
          <label 
            htmlFor="search-input"
            className="sr-only"
          >
            Search posts
          </label>
          <div className="search-input-wrapper">
            <input
              ref={inputRef}
              id="search-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts..."
              className="search-input"
              aria-label="Search posts"
              aria-describedby="search-hint"
              disabled={isSearching}
            />
            <button
              type="submit"
              className="search-button"
              aria-label="Submit search"
              disabled={isSearching || !query.trim()}
            >
              {isSearching ? (
                <span 
                  className="loading-spinner"
                  role="status"
                  aria-label="Searching..."
                />
              ) : (
                <span className="search-icon" aria-hidden="true">🔍</span>
              )}
            </button>
          </div>
          <div id="search-hint" className="sr-only">
            Press Enter to search, or use Ctrl+K (Cmd+K on Mac) to focus
          </div>
        </form>
      </div>
    </ErrorBoundary>
  );
}