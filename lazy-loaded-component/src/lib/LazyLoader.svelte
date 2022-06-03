<script lang="ts">
  import { onMount } from 'svelte';
  let loaded = false;
  let component: any;
  const isProd = import.meta.env.PROD;

  onMount(() => {
    if (isProd) {
      import(/* @vite-ignore */ `/my-big-component.umd.js`).then((module) => {
        loaded = true;
      });
    } else {
      import('./Big.svelte').then((module) => {
        component = module.default;
        loaded = true;
      });
    }
  });
</script>

{#if loaded}
  {#if isProd}
    <my-big-component {...$$props} />
  {:else}
    <svelte:component this={component} {...$$props} />
  {/if}
{:else}
  <slot />
{/if}
