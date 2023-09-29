<script lang="ts">
    import { createEventDispatcher } from "svelte"

    export let src: string
    export let css: string = ""
    let loaded = false
    let script_src = src // very strange bug...
    const dispatch = createEventDispatcher()

    function onload() {
        loaded = true
        dispatch("load", src)
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
    <script src={script_src} on:load={onload}></script>
    {#if css}
        <link href={css} rel="stylesheet" type="text/css" />
    {/if}
</svelte:head>

<slot {loaded} />
