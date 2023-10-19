import {
  Chat,
  FIELD_TYPE,
  FieldId,
  getDataKeyFromFieldType,
  getFieldTypeFromString,
  IErrorResponse,
  IFieldData,
  IResource,
  Search,
  SHORT_FIELD_TYPE,
  shortToLongFieldType,
} from '@nuclia/core';
import './SearchResults.css';
import { ResultRow } from './ResultRow';

export function SearchResults({
  results,
}: {
  results: Chat.Answer | IErrorResponse | null;
}) {
  let content;
  if (results?.type === 'error') {
    content = (
      <div className="error">Oops! An error occurred while searching…</div>
    );
  } else if (results?.type === 'answer') {
    content = (
      <>
        <div className="answer-container">{results.text || '…'}</div>
        <ol>
          {getSortedResults(
            Object.values(results.sources?.resources || {}),
          ).map((resource) => (
            <li key={resource.id}>
              <ResultRow resource={resource} />
            </li>
          ))}
        </ol>
      </>
    );
  }
  return <div className="SearchResults-container">{content}</div>;
}

function getSortedResults(
  resources?: Search.FindResource[],
): Search.FieldResult[] {
  if (!resources) {
    return [];
  }

  const keyList: string[] = [];
  return resources.reduce((resultList, resource) => {
    const fieldCount = Object.keys(resource.fields).length;
    const fieldEntries: Search.FieldResult[] = Object.entries(resource.fields)
      .filter(([fullFieldId]) => {
        // filter out title field when it’s not the only field
        const fieldType = fullFieldId.split('/')[1];
        return fieldCount === 1
          ? true
          : fullFieldId !== '/a/title' &&
              shortToLongFieldType(fieldType as SHORT_FIELD_TYPE) !== null;
      })
      .map(([fullFieldId, field]) => {
        let [, shortType, field_id] = fullFieldId.split('/');
        let fieldId: FieldId;

        if (shortType === SHORT_FIELD_TYPE.generic && resource.data) {
          // if matching field is generic, we take the first other field from resource data
          fieldId = Object.entries(resource.data)
            .filter(([, data]) => !!data)
            .map(([dataKey, data]) => {
              // data key is matching field type with an `s` suffix
              const fieldType = getFieldTypeFromString(
                dataKey.substring(0, dataKey.length - 1),
              );
              return {
                field_type: fieldType as FIELD_TYPE,
                field_id: Object.keys(data)[0],
              };
            })
            .filter((fullId) => {
              return fullId.field_type !== FIELD_TYPE.generic;
            })[0];
        } else {
          const field_type = shortToLongFieldType(
            shortType as SHORT_FIELD_TYPE,
          ) as FIELD_TYPE;
          fieldId = { field_id, field_type };
        }
        const fieldResult: Search.FieldResult = {
          ...resource,
          field: fieldId,
          fieldData: getFieldDataFromResource(resource, fieldId),
          paragraphs:
            fullFieldId !== '/a/title'
              ? Object.values(field.paragraphs).sort(
                  (a, b) => a.order - b.order,
                )
              : [],
        };

        // Don't include results already displayed:
        // sometimes load more bring results which are actually the same as what we got before but with another score_type
        const uniqueKey = getResultUniqueKey(fieldResult);
        if (!keyList.includes(uniqueKey)) {
          keyList.push(uniqueKey);
          return fieldResult;
        } else {
          return null;
        }
      })
      .filter((fieldResult) => !!fieldResult)
      .map((fieldResult) => fieldResult as Search.FieldResult);
    resultList = resultList.concat(fieldEntries);
    return resultList;
  }, [] as Search.FieldResult[]);
}

function getFieldDataFromResource(
  resource: IResource,
  field: FieldId,
): IFieldData | undefined {
  const dataKey = getDataKeyFromFieldType(field.field_type);
  return dataKey ? resource.data?.[dataKey]?.[field.field_id] : undefined;
}

function getResultUniqueKey(result: Search.FieldResult): string {
  return result.paragraphs && result.paragraphs.length > 0
    ? `${(result.paragraphs || []).reduce(
        (acc, curr) => `${acc}${acc.length > 0 ? '__' : ''}${curr.id}`,
        '',
      )}`
    : result.id;
}
