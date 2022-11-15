const { Nuclia } = require('@nuclia/core');
const { switchMap } = require('rxjs/operators');

require('localstorage-polyfill');
require('isomorphic-unfetch');

const nuclia = new Nuclia({
  backend: 'https://nuclia.cloud/api',
  zone: 'europe-1',
  knowledgeBox: 'YOUR-KB',
  apiKey: 'YOUR-CONTRIB-API-KEY',
});

const index = (content) => {
  const id = `article-${content.id}`;
  const resource = {
    title: content.Title,
    slug: id,
    texts: {
      text: {
        format: 'MARKDOWN',
        body: content.Body,
      },
    },
  };
  nuclia.db
    .getKnowledgeBox()
    .pipe(switchMap((kb) => kb.createOrUpdateResource(resource)))
    .subscribe({
      next: () => console.log(`Uploaded ${content.id} to Nuclia`),
      error: (err) => console.error(`Error with ${content.id}`, err),
    });
};
const unindex = (id) => {
  nuclia.db
    .getKnowledgeBox()
    .pipe(switchMap((kb) => kb.getResourceFromData({ id: '', slug: `article-${id}` }).delete()))
    .subscribe({
      next: () => console.log(`${content.id} deleted`),
      error: (err) => console.error(`Error when deleting ${content.id}`, err),
    });
};

module.exports = {
  afterUpdate(event) {
    if (event.params.data.publishedAt === null) {
      unindex(event.result.id);
    } else if (!!event.params.data.publishedAt || !!event.result.publishedAt) {
      index(event.result);
    }
  },
  async beforeDelete(event) {
    const entry = await strapi.db.query('api::article.article').findOne({
      where: { id: event.params.where.id },
    });
    if (entry.publishedAt) {
      unindex(event.params.where.id);
    }
  },
  async beforeDeleteMany(event) {
    console.log(event.params.where['$and']);
    const entries = await strapi.db.query('api::article.article').findMany({
      where: event.params.where,
    });
    entries.forEach((entry) => unindex(entry.id));
  },
};
