import { Search } from '@nuclia/core';
import './ResultRow.css';

export function ResultRow({ resource }: { resource: Search.FieldResult }) {
  const paragraphs = (resource.paragraphs || []).map((paragraph) => (
    <li
      key={paragraph.id}
      className="paragraph">
      {paragraph.text}
    </li>
  ));
  return (
    <div className="ResultRow">
      <a
        href={resource.origin?.url}
        target="_blank"
        rel="noreferrer">
        <h3>{resource.title}</h3>
        <ul className="paragraph-container">{paragraphs}</ul>
      </a>
    </div>
  );
}
