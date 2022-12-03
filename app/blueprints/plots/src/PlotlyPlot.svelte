<script context="module" lang="ts">
    // generated in plot.html page
    declare const PlotConfig: PlotConfigType;
    const gvalue: string = "module value";
    import type { Data, Layout } from "plotly.js";
    type Param = {
        data: Data[];
        layout?: Partial<Layout>;
    };
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import { PlotlyLib as Plotly } from "./plotly_store";
    let data: Data[];
    onMount(async () => {
        const resp = await fetch(PlotConfig.data_url);
        const res = await resp.json();
        data = res.data;
    });

    // const layout = {
    //     height: 400,
    //     width: 500,
    // };
    function plotly(node: HTMLElement, param: Param) {
        $Plotly!.newPlot(node, param.data, param.layout); // promise
        return {
            update(param: Param) {
                $Plotly!.react(node, param.data, param.layout);
            },
            destroy() {
                $Plotly!.purge(node);
            },
        };
    }
    let plot2: HTMLElement;
    $: if (plot2 && $Plotly) $Plotly.newPlot(plot2, data);
</script>

Plots {gvalue}!

{#if data}
    <div class="plotly mx-auto" use:plotly={{ data }} />

    <div class="plotly mx-auto" bind:this={plot2} />
{:else}
    <div class="plotly mx-auto text-center align-middle">
        <i class="fas fa-spinner fa-spin h2" />
    </div>
{/if}

<style>
    .plotly {
        width: 500px;
        height: 400px;
    }
</style>
