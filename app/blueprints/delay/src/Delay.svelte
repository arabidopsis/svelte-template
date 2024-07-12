<script context="module" lang="ts">
    type Config = Readonly<{
        DELTA: number
    }>
    // pick up  const Config from delay.html
    declare global {
        var Config: Config
    }
</script>

<script lang="ts">
    import { tick } from "svelte"
    import { keepInView, wait } from "./lib"
    const pubmedids = $state([
        100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113,
        114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127,
        128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141,
        142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
        156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169,
        170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183,
        184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197,
        198, 199,
    ].map((v) => {
        return { pmid: v, status: "pending", msg: "todo" }
    }))
    let viewport: HTMLElement

    let total = $state(0)
    let running_idx = $state(-1)
    let current: HTMLElement | null = $state(null)
    let cancel_pending = $state(false)

    // let quota = 0;
    // let where = "";
    $effect(() => {
        keepInView(current, viewport)
    })
    let restart = $derived(
        pubmedids.reduce((acc, { status }) => acc || status === "done", false),
    )
    let percent = $derived(((100 * (running_idx + 1)) / pubmedids.length).toFixed(0))

    const config = Config
    const delta = Config.DELTA



    function reset() {
        // total = 0;
        running_idx = -1
        current = null
        cancel_pending = false
    }

    async function getpubmed(pubmed: number): Promise<number> {
        const resp = await fetch(`/fetch/${pubmed}`)
        const result = await resp.json()
        return result.result as number
    }

    async function start() {
        let result: number
        let start = Date.now()
        for (let i = 0; i < pubmedids.length; ++i) {
            if (cancel_pending) break
            let { pmid, status } = pubmedids[i]
            if (status === "done") {
                continue
            }
            await tick()
            running_idx = i
            let end = Date.now()
            let dt = delta - (end - start)
            if (dt > 0) {
                await wait(dt)
            }
            total += pmid * 2

            // do work here
            result = await getpubmed(pmid)
            pubmedids[i] = {
                pmid,
                msg: `done ${result} ${dt}`,
                status: "done",
            }
            start = Date.now()
        }
        reset()
    }

    function stop() {
        cancel_pending = true
    }
</script>

{#if running_idx < 0}
    <button class="btn btn-primary" onclick={start}
        >{#if restart}Re
        {/if}Start (delay={config.DELTA}ms)</button
    >
{:else}
    <button
        class="btn btn-warning btn-sm"
        onclick={stop}
        disabled={cancel_pending}>Cancel</button
    >
    {percent}% completed
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
                    <i class="fas fa-spinner fa-spin"></i>
                    <button
                        bind:this={current}
                        class="btn btn-warning btn-sm"
                        onclick={stop}
                        disabled={cancel_pending}>Cancel</button
                    >
                {:else}
                    <span class={status}>{msg}</span>
                    {#if status === "done"}
                        <i class="fas fa-check"></i>
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
