<script lang="ts">
    import { fade } from "svelte/transition";
    let loaded = false;
    function onload() {
        loaded = true;
    }
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
        // or a DOM element,
        // new Chart() in case of ES6 module with above usage
        title: "My Awesome Chart",
        data: data,
        type: "percentage", // or 'bar', 'line', 'scatter', 'pie', 'percentage'
        height: 400,
        colors: ["#7cd6fd", "#743ee2"],
    };

    function frappe(node: HTMLElement, config) {
        const chart = new window.frappe.Chart(node, config);
        return {
            update(data) {
                chart.update(data)
            }
        }
    }
</script>

<svelte:head>
    <script
        src="https://cdn.jsdelivr.net/npm/frappe-charts@1.2.4/dist/frappe-charts.min.iife.js"
        on:load={onload}
    ></script>
</svelte:head>

{#if loaded}
    <div use:frappe={config} transition:fade />
{:else}
    Loading...
{/if}
