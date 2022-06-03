<svelte:options tag="my-counter" />

<script lang="ts">
  import LazyLoader from './LazyLoader.svelte';
  import Shared from './Shared.svelte';

  let count: number = 0;
  const increment = () => {
    count += 1;
  };
</script>

<button on:click={increment}>
  Clicks: {count}
</button>
<Shared />
{#if count > 0}
  <LazyLoader />
{:else}
  <div>Increase the counter to load the component</div>
{/if}

<style>
  button {
    font-family: inherit;
    font-size: inherit;
    padding: 1em 2em;
    color: #ff3e00;
    background-color: rgba(255, 62, 0, 0.1);
    border-radius: 2em;
    border: 2px solid rgba(255, 62, 0, 0);
    outline: none;
    width: 200px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
  }

  button:focus {
    border: 2px solid #ff3e00;
  }

  button:active {
    background-color: rgba(255, 62, 0, 0.2);
  }
</style>
