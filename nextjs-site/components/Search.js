import { useState, useCallback } from 'react';
import { Nuclia, ReadableResource } from '@nuclia/core';
import styles from '../styles/Results.module.css';

const kb = new Nuclia({
  backend: 'https://stashify.cloud/api',
  zone: 'europe-1',
  knowledgeBox: '<YOUR-KB-ID>',
}).knowledgeBox;

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const onChange = useCallback((e) => {
    const query = e.target.value;
    setQuery(query);
    kb.search(query, [], {
      show: ['basic', 'extracted'],
      extracted: ['text', 'metadata'],
    }).subscribe((results) => {
      const sentences = results?.sentences?.results.map((result) => ({
        text: result.text,
        rid: result.rid,
      }));
      const resultsByRID = (sentences || []).reduce((acc, result) => {
        if (!acc[result.rid]) {
          const resource = new ReadableResource(results?.resources[result.rid]);
          const ner = resource.getNamedEntities();
          acc[result.rid] = {
            title: resource.title,
            sentences: [result.text],
            ner,
          };
        } else {
          acc[result.rid].sentences.push(result.text);
        }
        return acc;
      }, {});
      setResults(Object.values(resultsByRID));
    });
  }, []);

  return (
    <div>
      <form>
        <input placeholder="Enter your question here" onChange={onChange} value={query} />
      </form>
      <div className={styles.container}>
        {results.map((result, index) => (
          <div key={`result-${index}`}>
            <h4>{result.title || 'No title'}</h4>
            <dl className={styles.ner}>
              {Object.entries(result.ner).map((entry, nidx) => [
                <dt key={`ner-${index}-${nidx}`}>{entry[0]}</dt>,
                <dd key={`ner-${index}-${nidx}-dd`}>
                  {entry[1].map((value, vidx) => (
                    <span key={`ner-${index}-${nidx}-${vidx}`}>{value}</span>
                  ))}
                </dd>,
              ])}
            </dl>
            <ul>
              {(result.sentences || []).map((sentence, sidx) => (
                <li key={`sentence-${index}-${sidx}`}>{sentence}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
