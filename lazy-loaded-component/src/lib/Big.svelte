<svelte:options tag="my-big-component" />

<script>
  import Shared from './Shared.svelte';

  $: console.log('I am a big component');
</script>

<div>Big component</div>
I also use the shared component: <Shared />
