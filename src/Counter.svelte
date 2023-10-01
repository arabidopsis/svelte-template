<script lang="ts">
    import { toastr } from "./lib/toastr"
    export let count: number = 0
    const increment = () => {
        count += 1
        toastr.success(`count ${count}`)
    }
</script>

<button on:click={increment}>
    count is {count}
</button>
