<script context="module" lang="ts">
    type loader = () => void
    const pending = new Map<string, loader[]>()
    const beenloaded = new Set<string>()
</script>

<script lang="ts">
    import { createEventDispatcher, tick } from "svelte"
    import EnsureLib from "./EnsureLib.svelte"

    export let src: string
    export let css: string = ""

    const dispatch = createEventDispatcher()

    let needsloading = false
    let loaded = false

    if (beenloaded.has(src)) {
        tick().then(load)
    } else if (pending.has(src)) {
        pending.get(src)!.push(load)
    } else {
        needsloading = true
        pending.set(src, [load])
    }

    function onload() {
        beenloaded.add(src)
        const funcs = pending.get(src)
        pending.delete(src)
        funcs?.forEach((f) => f())
    }

    function load() {
        loaded = true
        try {
            dispatch("load", src)
        } catch (e) {
            console.log(`load error: ${src}`, e)
        }
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
	</Require>
-->
{#if needsloading}
    <EnsureLib {src} {css} on:load={onload} let:loaded>
        <slot {loaded} />
    </EnsureLib>
{:else}
    <slot {loaded} />
{/if}
