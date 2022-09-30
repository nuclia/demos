const fs = require('fs');
const path = require('path');
const { forkJoin, of } = require('rxjs');
const { switchMap, delay } = require('rxjs/operators');
const { Nuclia } = require('@nuclia/core');
require('localstorage-polyfill');
require('isomorphic-unfetch');

const nuclia = new Nuclia({
  backend: 'https://nuclia.cloud/api',
  zone: 'europe-1',
  knowledgeBox: '<YOUR-KB-ID>',
  apiKey: '<YOUR-API-KEY>',
});

const uploadPosts = (kb) => {
  // Get posts
  const postsDir = path.join(process.cwd(), 'pages', 'posts');
  const posts = fs.readdirSync(postsDir);

  posts
    .filter((post) => post.endsWith('.mdx'))
    .forEach((post) => {
      const postPath = path.join(postsDir, post);
      const postContent = fs.readFileSync(postPath, 'utf8');
      const postTitle = postContent.split('\n')[0].replace('# ', '');
      const postSlug = post.replace('.mdx', '');

      // Find external links and local files
      const markdownLinks = [...postContent.matchAll(/\[.*?\]\((.*?)\)/g)].map((match) => match[1]);
      const links = markdownLinks
        .filter((link) => link.startsWith('http'))
        .reduce((all, link, index) => {
          all[`link-${index}`] = { uri: link };
          return all;
        }, {});
      const localFiles = markdownLinks.filter((link) => link.startsWith('/medias'));

      // Upload post to Nuclia
      const resource = {
        title: postTitle,
        slug: postSlug,
        texts: {
          text: {
            format: 'MARKDOWN',
            body: postContent,
          },
        },
        links,
      };
      kb.createResource(resource, true)
        .pipe(
          delay(500), // due to temporary bug in Nuclia POST /resources
          switchMap((data) =>
            localFiles.length > 0
              ? kb.getResource(data.uuid, [], []).pipe(
                  switchMap((resource) =>
                    forkJoin(
                      localFiles.map((file) => {
                        const filePath = path.join(process.cwd(), 'public', file);
                        const fileContent = fs.readFileSync(filePath).buffer;
                        const fileName = file.split('/').pop();
                        return resource.upload(fileName, fileContent);
                      }),
                    ),
                  ),
                )
              : of(true),
          ),
        )
        .subscribe({
          next: () => console.log(`Uploaded ${postSlug} to Nuclia`),
          error: (err) => console.error(`Error with ${postSlug}`, err),
        });
    });
};

nuclia.db.getKnowledgeBox().subscribe((kb) => uploadPosts(kb));
