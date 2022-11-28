<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let src: string;
	let loaded = false;
	const dispatch = createEventDispatcher();

	function onload() {
		loaded = true;
		dispatch("load", src);
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
	<script {src} on:load={onload}></script>
</svelte:head>

<slot {loaded} />
