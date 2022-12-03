<script>
    // npm install -D @types/plotly.js
    import Require from "../../../../src/lib/Require.svelte";
    import { PlotlyLib } from "./plotly_store";

    function onload() {
        if (!$PlotlyLib) $PlotlyLib = window?.Plotly;
    }
</script>

<Require
    src="https://cdn.plot.ly/plotly-2.16.1.min.js"
    on:load={onload}
    let:loaded
>
    <slot {loaded} />
</Require>
