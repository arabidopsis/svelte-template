<script context="module" lang="ts">
    type Config = Readonly<{
        DELTA: number;
    }>;
    // pick up  const Config from delay.html
    declare global {
        var Config: Config;
    }
</script>

<script lang="ts">
    import { tick } from "svelte";
    import { keepInView, wait } from "./lib";
    let total = 0;
    let running_idx = -1;
    let current: HTMLElement | null = null;
    let viewport: HTMLElement | null = null;
    let cancel_pending = false;

    // let quota = 0;
    // let where = "";
    $: keepInView(current, viewport);
    $: restart = pubmedids.reduce(
        (acc, { status }) => acc || status === "done",
        false
    );

    const config = Config;
    const delta = Config.DELTA;

    const pubmedids = [
        100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113,
        114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127,
        128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141,
        142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
        156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169,
        170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183,
        184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197,
        198, 199,
    ].map((v) => {
        return { pmid: v, status: "pending", msg: "todo" };
    });

    function reset() {
        // total = 0;
        running_idx = -1;
        current = null;
        cancel_pending = false;
    }

    async function start() {
        let start = Date.now();
        for (let i = 0; i < pubmedids.length; ++i) {
            if (cancel_pending) break;
            let { pmid, status } = pubmedids[i];
            if (status === "done") {
                continue;
            }
            await tick();
            running_idx = i;
            let end = Date.now();
            let dt = delta - (end - start);
            if (dt > 0) {
                await wait(dt);
            }
            total += pmid * 2;
            pubmedids[i] = {
                pmid,
                msg: `done ${pmid * 2} ${dt}`,
                status: "done",
            };
            start = Date.now();
        }
        reset();
    }

    function stop() {
        cancel_pending = true;
    }
</script>

{#if running_idx < 0}
    <button class="btn btn-primary" on:click={start}
        >{#if restart}Re {/if}Start (delay={config.DELTA}ms)</button
    >
{:else}
    <button
        class="btn btn-warning btn-sm"
        on:click={stop}
        disabled={cancel_pending}>Cancel</button
    >
    {((100 * (running_idx + 1)) / pubmedids.length).toFixed(0)}% completed
{/if}
<code>
    {total}
</code>
<div bind:this={viewport} class="viewport">
    <ol>
        {#each pubmedids as { pmid, msg, status }, i}
            {@const running = running_idx === i}
            <li class:running>
                {pmid}
                {#if running}
                    fetching
                    <i class="fas fa-spinner fa-spin" />
                    <button
                        bind:this={current}
                        class="btn btn-warning btn-sm"
                        on:click={stop}
                        disabled={cancel_pending}>Cancel</button
                    >
                {:else}
                    <span class={status}>{msg}</span>
                    {#if status === "done"}
                        <i class="fas fa-check" />
                    {/if}
                {/if}
            </li>
        {/each}
    </ol>
</div>

<style>
    .viewport {
        overflow: auto;
        max-height: 50vh;
    }
    li.running {
        color: var(--bs-danger, red);
    }
    .pending {
        color: var(--bs-warning, orange);
    }
    .done {
        color: var(--bs-success, green);
    }
</style>
