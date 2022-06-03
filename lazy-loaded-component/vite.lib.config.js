import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: './src/lib.ts',
      name: 'MyLibrary',
      fileName: 'main-component',
    },
    rollupOptions: {
      external: ['/my-big-component.umd.js'],
    },
  },
  plugins: [
    svelte({
      include: ['src/lib/*.svelte'],
      exclude: ['src/lib/Counter.svelte'],
      preprocess: sveltePreprocess(),
      compilerOptions: {
        css: true,
      },
    }),
    svelte({
      include: ['src/lib/Counter.svelte'],
      preprocess: sveltePreprocess(),
      compilerOptions: {
        css: true,
        customElement: true,
      },
    }),
  ],
});
