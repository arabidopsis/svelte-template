<script lang="ts">
    // npm install -D @types/google.visualization
    import Require from "../../../../src/lib/Require.svelte";

    export let packages: string[] = ["corechart"];
    export let version: string = "current";

    let loaded = false;
    function onload() {
        google.charts.load(version, { packages });
        google.charts.setOnLoadCallback(() => (loaded = true));
    }
</script>

<Require src="https://www.gstatic.com/charts/loader.js" on:load={onload}>
    <slot {loaded} />
</Require>
