import './SearchBar.css';
import crossGlyph from '../assets/cross.svg';
import searchGlyph from '../assets/search.svg';
import React, { useRef, useState } from 'react';

export function SearchBar({
  onQueryChange,
}: {
  onQueryChange: (value: string) => void;
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function clearQuery() {
    setQuery('');
    onQueryChange('');
  }

  function onEnter() {
    onQueryChange(query);
    inputRef.current?.blur();
  }

  return (
    <div className="SearchBar-container">
      <div className="SearchBar-glyph">
        {!!query ? (
          <button
            className="clear-button"
            tabIndex={-1}
            onClick={() => clearQuery()}>
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
        ref={inputRef}
        type="text"
        placeholder="Type your question about Nuclia here…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyUp={(e) => e.key === 'Enter' && onEnter()}
      />
    </div>
  );
}
