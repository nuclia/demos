import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: './src/big-lib.ts',
      name: 'MyBigLibrary',
      fileName: 'my-big-component',
    },
  },
  plugins: [
    svelte({
      include: ['src/lib/Shared.svelte'],
      exclude: ['src/lib/Big.svelte'],
      preprocess: sveltePreprocess(),
      compilerOptions: {
        css: true,
      },
    }),
    svelte({
      include: ['src/lib/Big.svelte'],
      preprocess: sveltePreprocess(),
      compilerOptions: {
        css: true,
        customElement: true,
      },
    }),
  ],
});
