import React, { useState } from 'react';
import logo from './assets/logo.svg';
import logoSmall from './assets/logo-symbol.svg';
import './App.css';
import {
  IErrorResponse,
  Nuclia,
  ResourceProperties,
  Search,
} from '@nuclia/core';
import { SearchBar } from './search-bar/SearchBar';
import { SearchResults } from './search-results/SearchResults';

function App() {
  const nuclia = new Nuclia({
    backend: 'https://nuclia.cloud/api',
    zone: 'europe-1',
    knowledgeBox: 'df8b4c24-2807-4888-ad6c-ae97357a638b',
  });
  const [results, setResults] = useState<
    Search.FindResults | IErrorResponse | null
  >(null);
  let searchTimeout: NodeJS.Timeout;

  function search(query: string) {
    clearTimeout(searchTimeout);
    if (!query) {
      return setResults(null);
    }
    // debounce while typing query
    searchTimeout = setTimeout(() => {
      nuclia.asyncKnowledgeBox
        .find(query, [Search.Features.PARAGRAPH, Search.Features.VECTOR], {
          show: [
            ResourceProperties.BASIC,
            ResourceProperties.VALUES,
            ResourceProperties.ORIGIN,
          ],
        })
        .then((results) => setResults(results));
    }, 300);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={logo}
          className="App-logo"
          alt="Nuclia"
        />
        <img
          src={logoSmall}
          className="App-logo small"
          alt="Nuclia"
        />
        <h1>React search widget example</h1>
      </header>
      <div className="App-body">
        <div className="search-bar-container">
          <SearchBar onQueryChange={search} />
        </div>
        <div className="search-results-container">
          <SearchResults results={results} />
        </div>
      </div>
    </div>
  );
}

export default App;
