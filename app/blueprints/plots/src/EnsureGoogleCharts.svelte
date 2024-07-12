<script lang="ts">
    // npm install -D @types/google.visualization
    import Require from "$lib/Require.svelte"
    type Props = {
        packages: string[]
        version: string
    }
    const { packages = ["corechart"], version = "current" }: Props = $props()

    let loaded = $state(false)
    function onload() {
        google.charts.load(version, { packages })
        google.charts.setOnLoadCallback(() => (loaded = true))
    }
</script>

<Require src="https://www.gstatic.com/charts/loader.js" on:load={onload}>
    <slot {loaded} />
</Require>
