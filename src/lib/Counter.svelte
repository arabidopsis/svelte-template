<script type="ts">
  import { toastr } from "./toastr";
  export let count: number;
  const increment = () => {
    count += 1;
    toastr.success(`count ${count}`);
  };
</script>

<button on:click={increment}>
  count is {count}
</button>
