<script lang="ts">
    import { onDestroy } from "svelte";

    export let height: number = 5;
    export let width: number = 25;
    export let delta: number = 2.5;
    export let color: string = "bg-danger";

    let w: number = 0;
    $: margin_left = `${w}%`;
    const mx = 100 - width;

    let interval: number | null = null;
    let display: string = "none";

    export function start() {
        if (interval) return;
        display = "flex";
        interval = setInterval(() => {
            w = w + delta;
            if (w > mx) {
                // w = mx;
                delta = -delta;
            } else if (w < 0) {
                // w = 0;
                delta = -delta;
            }
        }, 50);
    }
    export function stop() {
        if (interval) clearInterval(interval);
        interval = null;
        display = "none";
    }
    onDestroy(stop);
</script>

<div class="progress" style:height="{height}px" style:display>
    <div
        class="progress-bar progress-bar-striped {color}"
        role="progressbar"
        style:width="{width}%"
        style:margin-left={margin_left}
    />
</div>

<style>
    .progress {
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100%;
        background-color: transparent;
        z-index: 500;
    }
</style>
