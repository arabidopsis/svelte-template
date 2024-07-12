<script lang="ts">
    // adapted from https://github.com/Alex-D/Cookies-EU-banner
    import type {Snippet} from 'svelte'
    import { createEventDispatcher } from "svelte";
    import { fly } from "svelte/transition";
    type Props = {
        children?:Snippet
    }
    const { children }:Props = $props()
    const dispatch = createEventDispatcher();

    const isBot = /bot|crawler|spider|crawling/i.test(navigator.userAgent);

    // Check if DoNotTrack is activated
    const dnt = navigator.doNotTrack; // || navigator.msDoNotTrack || window.doNotTrack;
    const isToTrack =
        dnt !== null && dnt !== undefined
            ? dnt && dnt !== "yes" && dnt !== "1"
            : true;

    let show = $state(!(isBot || !isToTrack));

    function reject(e: Event) {
        dispatch("reject", e);
        show = false;
    }
    function accept(e: Event) {
        dispatch("accept", e);
        show = false;
    }
</script>

{#if show}
    <div class="eu-banner" transition:fly|global={{ y: 200, duration: 2000 }}>
        {#if children}
        {@render children()}
        {:else}

            By continuing to visit this site, you accept the use of cookies by
            Google Analytics for statistical purposes.

        {/if}
        <button class="reject" onclick={reject}>Reject</button>
        <button class="accept" onclick={accept}>Accept</button>
    </div>
{/if}

<style>
    .eu-banner {
        /* position: sticky; */
        position: fixed;
        left: 50%;
        transform: translate(-50%, 0px);
        bottom: 5px;
        display: block;

        background: #444;
        color: #fff;
        padding: 6px;
        font-size: 13px;
        text-align: center;
    }
    button {
        text-decoration: none;
        background: #222;
        color: #fff;
        border: 1px solid #000;
        cursor: pointer;
        padding: 4px 7px;
        margin: 2px 0;
        font-size: 13px;
        font-weight: bold;
        transition: background 0.07s, color 0.07s, border-color 0.07s;
    }
    .accept:hover,
    .accept:focus {
        background: #fff;
        color: #222;
    }

    .reject {
        background: none;
        font-weight: normal;
        color: #ccc;
        cursor: pointer;
        padding: 4px 7px;
        margin: 2px 0;
        border: 1px solid #666;
    }
    .reject:hover,
    .reject:focus {
        border-color: #fff;
        background: #222;
        color: #fff;
    }
</style>
