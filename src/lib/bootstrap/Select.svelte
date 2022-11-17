<script lang="ts">
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import Tags from "bootstrap5-tags";
  export let options: string[] = [];
  let selected: string[] = [];
  let select: HTMLSelectElement;
  const dispatch = createEventDispatcher();
  onMount(() => {
    const tags = new Tags(select);
    return () => tags.dispose();
  });
  $: dispatch("selected", selected);
</script>

see <a href="https://github.com/lekoala/bootstrap5-tags">repo</a>
<select
  bind:this={select}
  class="form-select"
  size="3"
  multiple
  bind:value={selected}
  data-badge-style="info"
>
  <option disabled hidden value="">Choose a tag...</option>
  {#each options as option (option)}
    <option value={option}>{option}</option>
  {/each}
</select>
<div class="invalid-feedback">Please select a valid tag.</div>
Selected:
{#each selected as s}
  <code class="selected m-1">{s}</code>
{/each}
