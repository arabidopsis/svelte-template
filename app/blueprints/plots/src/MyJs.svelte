<script>
    import Require from "$lib/Require.svelte"
    let added = false
    setTimeout(() => {
        added = true
    }, 5000)
    let loaded = $state(false)
</script>

{#if added}
    <Require src="/myjs.js" bind:loaded on:load={() => console.log("require3")}>
        {#if loaded}
            loaded is true myjs={window.myjs}
        {:else}
            waiting for myjs <i class="fas fa-spinner fa-spin" ></i>
        {/if}
    </Require>
{:else}
    Waiting...
{/if}
<br />
<Require src="/myjs.js" let:loaded on:load={() => console.log("require1")}>
    {#if loaded}
        1 myjs={window.myjs}
    {:else}
        1 loading myjs <i class="fas fa-spinner fa-spin" ></i>
    {/if}
</Require>

<Require src="/myjs.js" let:loaded on:load={() => console.log("require2")}>
    {#if loaded}
        2 myjs={window.myjs}
    {:else}
        2 loading myjs <i class="fas fa-spinner fa-spin" ></i>
    {/if}
</Require>
