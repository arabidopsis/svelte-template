<script lang="ts">
    // npm install -D @types/plotly.js
    import Require from "$lib/Require.svelte"
    import type { Snippet } from "svelte"
    import { PlotlyLib } from "./plotly_store"
    let {
        src = "https://cdn.plot.ly/plotly-2.16.1.min.js",
        loaded = $bindable(false),
        children
    }: { src?: string , loaded?: boolean, children: Snippet } = $props()
    // let loaded = $state(false)
    function onload() {
        if (!$PlotlyLib) $PlotlyLib = window?.Plotly
        loaded = true
    }
</script>

<Require {src} on:load={onload}>
    {@render children()}
</Require>
