<script>
    import PlotlyPlot from "./PlotlyPlot.svelte";
    //import EnsureLib from "./EnsureLib.svelte";
    import EnsurePlotly from "./EnsurePlotly.svelte";
    // import { PlotlyLib } from "./store";
    let added = false;
    setTimeout(() => {
        added = true;
    }, 5000);
</script>

{#if added}
    <EnsurePlotly let:loaded>
        {#if loaded}
            loaded is true
        {:else}
            waiting for plotly <i class="fas fa-spinner fa-spin" />
        {/if}
    </EnsurePlotly>
{:else}
    Waiting...
{/if}
<br />
<EnsurePlotly let:loaded>
    {#if loaded}
        Plot 1
        <PlotlyPlot />
    {:else}
        loading plotly <i class="fas fa-spinner fa-spin" />
    {/if}
</EnsurePlotly>
