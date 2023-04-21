<script context="module" lang="ts">
    // pnpm i -D @types/dropzone
    import type { DropzoneFile } from "dropzone"
    declare global {
        var Dropzone: typeof Dropzone
    }
</script>

<script lang="ts">
    import Require from "../../../../src/lib/Require.svelte"

    let dropzone: Dropzone
    let uploaded: string
    function onload() {
        //setTimeout(() => Dropzone.discover(), 0)
        dropzone = new Dropzone(form)
        dropzone.on("success", function (file: DropzoneFile, response: string) {
            console.log(file, response)
            uploaded = response
        })
    }
    let form: HTMLFormElement

    function remove() {
        dropzone.removeAllFiles()
    }
</script>

<Require
    src="https://unpkg.com/dropzone@6.0.0-beta.1/dist/dropzone-min.js"
    css="https://unpkg.com/dropzone@6.0.0-beta.1/dist/dropzone.css"
    on:load={onload}
>
    Upload a file
    <form action="/dropzone-upload" class="dropzone" bind:this={form} />
    Uploaded: {uploaded ?? "..."}
    {#if uploaded}
        <button class="btn btn-primary" on:click={remove}>
            Remove all files
        </button>
    {/if}
</Require>
