<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let src: string;
	export let loaded = false;
	const dispatch = createEventDispatcher();

	function onload() {
		loaded = true;
		dispatch("load", src);
	}
</script>

<!--
	<EnsureLib src="https://cdn.plot.ly/plotly-2.16.1.min.js">
		<Plotly />
		<Plotly />
	</EnsureLib>
-->
<svelte:head>
	<script {src} on:load={onload}></script>
</svelte:head>

{#if loaded}
	<slot />
{/if}
