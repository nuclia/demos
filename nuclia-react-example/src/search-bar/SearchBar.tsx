import './SearchBar.css';
import crossGlyph from '../assets/cross.svg';
import searchGlyph from '../assets/search.svg';
import { useState } from 'react';

export function SearchBar({
  onQueryChange,
}: {
  onQueryChange: (value: string) => void;
}) {
  const [query, setQuery] = useState('');

  function onChange(value: string) {
    setQuery(value);
    onQueryChange(value);
  }
  return (
    <div className="SearchBar-container">
      <div className="SearchBar-glyph">
        {!!query ? (
          <button
            className="clear-button"
            tabIndex={-1}
            onClick={() => onChange('')}>
            <img
              src={crossGlyph}
              alt="Clear query"
            />
          </button>
        ) : (
          <img
            src={searchGlyph}
            alt="Search"
          />
        )}
      </div>

      <input
        type="text"
        placeholder="Type your question about Nuclia here…"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
