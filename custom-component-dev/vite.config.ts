import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte({
      include: ['src/**/*.svelte'],
      exclude: ['src/lib/Counter.svelte'],
    }),
    svelte({
      include: ['src/lib/Counter.svelte'],
      compilerOptions: {
        customElement: true,
      },
    }),
    {
      name: 'hmr-scss',
      handleHotUpdate({ file, server, timestamp }) {
        if (file.endsWith('.scss')) {
          server.ws.send({
            type: 'update',
            updates: [
              {
                acceptedPath: '/src/lib/Counter.svelte',
                path: '/src/lib/Counter.svelte',
                timestamp: timestamp,
                type: 'js-update',
              },
            ],
          });
        }
      },
    },
  ],
});
