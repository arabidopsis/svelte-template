<script context="module" lang="ts">
    // generated in plot.html page
    declare const PlotConfig: PlotConfigType;
    type GD = {
        data: any[];
        options: google.visualization.PieChartOptions;
    };
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import EnsureGoogleCharts from "./EnsureGoogleCharts.svelte";

    let data: GD;
    function drawPieChart(node: HTMLElement, { data, options }: GD) {
        const tdata = google.visualization.arrayToDataTable(data);

        const chart = new google.visualization.PieChart(node);

        chart.draw(tdata, options);
    }

    // onMount(async () => {
    //     const resp = await fetch(PlotConfig.google_url);
    //     data = await resp.json();
    // });
    onMount(() => {
        fetch(PlotConfig.google_url)
            .then((resp) => resp.json())
            .then((v: GD) => (data = v));
    });
</script>

<h2 class="text-center">Google Charts</h2>
<EnsureGoogleCharts let:loaded>
    {#if loaded && data}
        <div class="mx-auto plot" use:drawPieChart={data} transition:fade />
    {:else}
        <div class="mx-auto plot waiting">
            {data ? "waiting for google" : "waiting for data"}
            <i class="fas fa-spinner fa-spin" />
        </div>
    {/if}
</EnsureGoogleCharts>

<style>
    .plot {
        width: 100%;
        height: 500px;
        border: solid black 1px;
    }
    .waiting {
        text-align: center;
        line-height: 500px;
        font-size: 50px;
    }
</style>
