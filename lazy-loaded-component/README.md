# Lazy loading Svelte components

## What is it?

See [https://nuclia.com/developers/how-to-build-lazy-loaded-custom-elements-with-svelte/](https://nuclia.com/developers/how-to-build-lazy-loaded-custom-elements-with-svelte/)

## How to run it

Build the main component:

```bash
yarn build -c=vite.lib.config.js
```

Move `dist/main-component.umd.js` to `www/`.

The build the sub component:

```bash
yarn build -c=vite.big-lib.config.js
```

And move `dist/my-big-component.umd.js` to `www/` too.

Now serve the www folder (note: it needs an HTTP server, it won't work by opening `index.html` from the file system, the path to the lazy loaded component would be incorrect)

For example:

```cd www
python3 -m http.server
```
