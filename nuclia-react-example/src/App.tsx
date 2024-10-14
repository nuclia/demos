import React, { useState } from 'react';
import logo from './assets/logo.svg';
import logoSmall from './assets/logo-symbol.svg';
import './App.css';
import { Ask, IErrorResponse, Nuclia, ResourceProperties } from '@nuclia/core';
import { SearchBar } from './search-bar/SearchBar';
import { SearchResults } from './search-results/SearchResults';

function App() {
  const nuclia = new Nuclia({
    backend: 'https://nuclia.cloud/api',
    zone: 'europe-1',
    knowledgeBox: '0a461f58-6ee4-4845-8942-1404c0e6f108',
  });
  const [results, setResults] = useState<Ask.Answer | IErrorResponse | null>(
    null,
  );

  function search(query: string) {
    if (!query) {
      return setResults(null);
    }
    nuclia.asyncKnowledgeBox.ask(
      query,
      undefined,
      [Ask.Features.SEMANTIC, Ask.Features.KEYWORD],
      {
        show: [
          ResourceProperties.BASIC,
          ResourceProperties.VALUES,
          ResourceProperties.ORIGIN,
        ],
      },
      (answer) => setResults(answer),
    );
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
