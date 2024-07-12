<script lang="ts">
    import { onDestroy } from "svelte";
    type Props = {
        height: number
        width: number
        delta: number
        color: string
    }
    const {height=5, width=25, delta=2.5, color='bg-danger'}:Props = $props()

    const mx = 100 - width;
    let ddelta = delta;

    let w: number = $state(0);
    let margin_left = $derived(`${w}%`)


    let interval: number | null = $state(null);
    let display: string = $state("none");

    export function start() {
        if (interval) return;
        display = "flex";
        interval = setInterval(() => {
            w = w + delta;
            if (w > mx) {
                // w = mx;
                ddelta = -ddelta;
            } else if (w < 0) {
                // w = 0;
                ddelta = -ddelta;
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
    ></div>
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
