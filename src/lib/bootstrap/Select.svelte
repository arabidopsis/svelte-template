<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Tags from "bootstrap5-tags";
  export let options: string[] = [];
  let selected: string[] = [];

  const dispatch = createEventDispatcher();

  function tags(node: HTMLSelectElement) {
    const tags = new Tags(node);
    return {
      destroy: () => {
        tags.dispose();
      },
    };
  }
  $: dispatch("selected", selected);
</script>

see <a href="https://github.com/lekoala/bootstrap5-tags">repo</a>
<select class="form-select" size="3" multiple use:tags data-badge-style="info">
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
