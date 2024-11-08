<script lang="ts">
    import { toastr } from "$lib/toastr"
    import { counter } from "./shared.svelte"
    // export let count: number = 0

    const increment = () => {
        counter.count += 1
        toastr.success(`count ${counter.count}`)
    }
</script>

<button onclick={increment} class="btn btn-outline-primary">
    count is {counter.count}
</button>
