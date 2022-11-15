const { Nuclia } = require('@nuclia/core');
const { of } = require('rxjs');
const { switchMap } = require('rxjs/operators');
const crypto = require('crypto');
const fs = require('fs');
require('localstorage-polyfill');
require('isomorphic-unfetch');

const nuclia = new Nuclia({
  backend: 'https://nuclia.cloud/api',
  zone: 'europe-1',
  knowledgeBox: 'YOUR-KB',
  apiKey: 'YOUR-CONTRIB-API-KEY',
});

const hasFileChanged = (id, resource, fileContent) => {
  if (resource.data.files && resource.data.files[id]) {
    const md5 = crypto.createHash('md5').update(fileContent).digest('hex');
    console.log('md5', md5, resource.data.files[id].md5);
    return md5 !== resource.data.files[id].file?.md5;
  }
};

const uploadFile = (kb, id, filename, fileContent, contentType) => {
  console.log(`Uploading ${filename} to ${id}`);
  return kb.getResourceFromData({ id: '', slug: id }).upload(id, fileContent.buffer, false, {
    contentType,
    filename,
  });
};

const index = (content) => {
  const filePath = `./public${content.Video.url}`;
  const filename = filePath.split('/').pop();
  const contentType = content.Video.mime;
  const id = `video-${content.id}`;
  const resourceData = {
    title: content.Title,
    slug: id,
  };
  nuclia.db
    .getKnowledgeBox()
    .pipe(
      switchMap((kb) =>
        kb.createOrUpdateResource(resourceData).pipe(
          switchMap(() => kb.getResourceBySlug(id, ['values'])),
          switchMap((res) => {
            const fileContent = fs.readFileSync(filePath);
            if (hasFileChanged(id, res, fileContent)) {
              return uploadFile(kb, id, filename, fileContent, contentType);
            } else {
              return of(null);
            }
          }),
        ),
      ),
    )
    .subscribe({
      next: () => console.log(`Uploaded ${id} to Nuclia`),
      error: (err) => console.error(`Error with ${id}`, err),
    });
};
const unindex = (id) => {
  nuclia.db
    .getKnowledgeBox()
    .pipe(switchMap((kb) => kb.getResourceFromData({ id: '', slug: `video-${id}` }).delete()))
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
    const entry = await strapi.db.query('api::video.video').findOne({
      where: { id: event.params.where.id },
    });
    if (entry.publishedAt) {
      unindex(event.params.where.id);
    }
  },
  async beforeDeleteMany(event) {
    console.log(event.params.where['$and']);
    const entries = await strapi.db.query('api::video.video').findMany({
      where: event.params.where,
    });
    entries.forEach((entry) => unindex(entry.id));
  },
};
