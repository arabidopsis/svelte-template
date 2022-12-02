<script context="module" lang="ts">
    const pending = new Map<string, (() => void)[]>();
    const beenloaded = new Map<string, boolean>();
</script>

<script lang="ts">
    import EnsureLib from "./EnsureLib.svelte";

    export let src: string;

    let needsloading = false;
    let loaded = false;

    if (beenloaded.has(src)) {
        loaded = true;
    } else if (pending.has(src)) {
        pending.get(src)!.push(() => (loaded = true));
    } else {
        needsloading = true;
        pending.set(src, []);
    }

    function onload() {
        beenloaded.set(src, true);
        const funcs = pending.get(src);
        pending.delete(src);
        funcs?.forEach((f) => f());
    }
</script>

<!--
    Deduped version of EnsureLib
	<Require src="https://cdn.plot.ly/plotly-2.16.1.min.js" let:loaded>
		{#if loaded}
			<Plotly />
			<Plotly />
		{:else}
			Loading...
		{/if}
	</EnsureLib>
-->
{#if needsloading}
    <EnsureLib {src} on:load={onload} let:loaded>
        <slot {loaded} />
    </EnsureLib>
{:else}
    <slot {loaded} />
{/if}
