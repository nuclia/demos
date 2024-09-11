import { useState, useCallback } from 'react';
import { Nuclia, ReadableResource, search } from '@nuclia/core';
import styles from '../styles/Results.module.css';

const kb = new Nuclia({
  backend: 'https://nuclia.cloud/api',
  zone: 'europe-1',
  knowledgeBox: 'YOUR_KB_ID',
}).knowledgeBox;

export default function Search() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [results, setResults] = useState([]);

  const onChange = useCallback((e) => setQuery(e.target.value), []);
  const search = (e) => {
    e.preventDefault();
    // kb.find(query, ['semantic', 'keyword']).subscribe((results) => {
    //   setResults(
    //     Object.values(results?.resources || {}).map((resource) => ({
    //       paragraphs: Object.values(resource.fields)
    //         .map((field) => Object.values(field.paragraphs).map((p) => p.text))
    //         .reduce((all, paragraphs) => [...all, ...paragraphs], []),
    //       title: resource.title || 'No title',
    //     })),
    //   );
    // });
    kb.ask(query).subscribe((answer) => {
      console.log(answer);
      setAnswer(answer?.text || '');
      setResults(
        Object.values(answer?.sources?.resources || {}).map((resource) => ({
          paragraphs: Object.values(resource.fields)
            .map((field) => Object.values(field.paragraphs).map((p) => p.text))
            .reduce((all, paragraphs) => [...all, ...paragraphs], []),
          title: resource.title || 'No title',
        })),
      );
    });
  };

  return (
    <div>
      <form>
        <input placeholder="Enter your question here" onChange={onChange} value={query} />
        <button onClick={search}>Ask</button>
      </form>
      <h3>Answer</h3>
      <p>{answer}</p>
      <h3>Results</h3>
      <div className={styles.container}>
        {results.map((result, index) => (
          <div key={`result-${index}`}>
            <h4>{result.title || 'No title'}</h4>
            <ul>
              {result.paragraphs.map((paragraph, index) => (
                <li key={`paragraph-${index}`}>{paragraph}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
