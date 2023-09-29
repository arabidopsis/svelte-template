<script lang="ts">
    import { fade } from "svelte/transition";
    import Require from "$lib/Require.svelte";
    const data = {
        labels: [
            "12am-3am",
            "3am-6pm",
            "6am-9am",
            "9am-12am",
            "12pm-3pm",
            "3pm-6pm",
            "6pm-9pm",
            "9am-12am",
        ],
        datasets: [
            {
                name: "Some Data",
                type: "pie",
                values: [25, 40, 30, 35, 8, 52, 17, -4],
            },
            // {
            //     name: "Another Set",
            //     type: "line",
            //     values: [25, 50, -10, 15, 18, 32, 27, 14],
            // },
        ],
    };
    const config = {
        title: "My Awesome Chart",
        data: data,
        type: "pie", // or 'bar', 'line', 'scatter', 'pie', 'percentage'
        height: 400,
        colors: ["#7cd6fd", "#743ee2"],
    };

    function frappe(node: HTMLElement, config) {
        const chart = new window.frappe.Chart(node, config);
        return {
            update(config) {
                chart.update(config);
            },
        };
    }
</script>

<h2 class="text-center">
    <a href="https://github.com/frappe/charts">Frappe</a> Plots
</h2>

<Require
    src="https://cdn.jsdelivr.net/npm/frappe-charts@1.2.4/dist/frappe-charts.min.iife.js"
    let:loaded
>
    {#if loaded}
        <div use:frappe={config} transition:fade />
    {:else}
        Loading...
    {/if}
</Require>
