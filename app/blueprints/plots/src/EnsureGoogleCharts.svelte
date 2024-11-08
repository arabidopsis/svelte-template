<script lang="ts">
    // npm install -D @types/google.visualization
    import Require from "$lib/Require.svelte"
    import type {Snippet} from 'svelte'

    let { packages = ["corechart"],
        version = "current", children } : {
        packages: string[]
        version: string
        children?: Snippet
    } = $props()


    let loaded = $state(false)
    function onload() {
        google.charts.load(version, { packages })
        google.charts.setOnLoadCallback(() => (loaded = true))
    }
</script>

<Require src="https://www.gstatic.com/charts/loader.js" on:load={onload}>
    {#if loaded && children}
    {@render children()}
    {/if}
</Require>
