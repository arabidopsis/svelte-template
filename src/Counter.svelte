<script lang="ts">
    import { toastr } from "$lib/toastr"
    // export let count: number = 0
    const { count=0 } = $props()
    let counter = $state(count)
    const increment = () => {
        counter += 1
        toastr.success(`count ${counter}`)
    }
</script>

<button onclick={increment}>
    count is {counter}
</button>
