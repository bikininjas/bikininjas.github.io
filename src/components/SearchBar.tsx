import * as React from 'react';
import { useState } from 'react';

interface SearchBarProps {
  readonly onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  return (
    <div className="mb-6 flex items-center">
      <input
        type="text"
        placeholder="Search articles..."
        className="w-full px-4 py-2 rounded-l-lg bg-gray-800 text-white focus:outline-none"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
        onClick={() => onSearch(query)}
      >
        Search
      </button>
    </div>
  );
}
