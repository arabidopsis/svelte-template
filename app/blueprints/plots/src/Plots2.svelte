<script>
    import PlotlyPlot from "./PlotlyPlot.svelte"
    //import EnsureLib from "./EnsureLib.svelte";
    import EnsurePlotly from "./EnsurePlotly.svelte"
    // import { PlotlyLib } from "./store";
    let added = $state(false)
    let loaded = $state(false)
    setTimeout(() => {
        added = true
    }, 10000)
</script>

{#if added}
    <EnsurePlotly bind:loaded>
        {#if loaded}
            loaded is {loaded}
        {:else}
            loaded is {loaded} waiting for plotly
            <i class="fas fa-spinner fa-spin"></i>
        {/if}
    </EnsurePlotly>
{:else}
    Waiting for added...
{/if}
<br />
<EnsurePlotly bind:loaded>
    {#if loaded}
        Plot 1
        <PlotlyPlot />
    {:else}
        loaded is {loaded} loading plotly <i class="fas fa-spinner fa-spin"></i>
    {/if}
</EnsurePlotly>
