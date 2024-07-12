<script context="module" lang="ts">
    type loader = () => void
    const pending = new Map<string, loader[]>()
    const beenloaded = new Set<string>()
</script>

<script lang="ts">
    import { createEventDispatcher, tick, type Snippet } from "svelte"
    import EnsureLib from "./EnsureLib.svelte"
    type Props = {
        src: string
        css?: string
        children?: Snippet
        onload?: (e:Event) => void
    }
    const { src, css, children }: Props = $props()

    const dispatch = createEventDispatcher()

    let needsloading = $state(false)

    if (beenloaded.has(src)) {
        tick().then(load)
    } else if (pending.has(src)) {
        pending.get(src)!.push(load)
    } else {
        needsloading = true
        pending.set(src, [load])
    }

    function onload(e:Event) {
        beenloaded.add(src)
        const funcs = pending.get(src)
        pending.delete(src)
        funcs?.forEach((f) => f())
    }

    function load() {
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
    <EnsureLib {src} {css} onload={onload} {children} />
{:else}
{#if children}{@render children()}{/if}
{/if}
