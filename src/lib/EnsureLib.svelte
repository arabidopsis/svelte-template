<script lang="ts">
    // import { createEventDispatcher } from "svelte"
    import type {Snippet} from 'svelte'
    type Props = {
        src: string
        css?: string
        children?: Snippet
        onload?: (e:Event) => void
    }
    const { src, css, onload , children }: Props = $props()
    const script_src: string = src
    let loaded = $state(false)

    // const dispatch = createEventDispatcher()

    function ionload(e:Event) {
        loaded = true
        if(onload) onload(e)
    }
</script>

<!--
	<EnsureLib src="https://cdn.plot.ly/plotly-2.16.1.min.js" let:loaded>
		{#if loaded}
			<Plotly />
			<Plotly />
		{:else}
			Loading...
		{/if}
	</EnsureLib>
-->
<svelte:head>
    <script src={script_src} onload={ionload}></script>
    {#if css}
        <link href={css} rel="stylesheet" type="text/css" />
    {/if}
</svelte:head>
{#if loaded && children}
    {@render children()}
{/if}
