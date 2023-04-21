<script context="module" lang="ts">
    // pnpm i -D @types/dropzone
    import type { DropzoneFile, DropzoneOptions } from "dropzone"
    declare global {
        var Dropzone: typeof Dropzone
    }
</script>

<script lang="ts">
    // import Require from "../../../../src/lib/Require.svelte"
    import Require from "$lib/Require.svelte"
    let dropzone: Dropzone
    let uploaded: string
    const options: DropzoneOptions = {
        dictDefaultMessage: "Drop dem file here bro!",
    }
    function onload() {
        //setTimeout(() => Dropzone.discover(), 0)
        dropzone = new Dropzone(form, options)
        dropzone.on("success", function (file: DropzoneFile, response: string) {
            console.log(file, response)
            uploaded = response
        })
    }
    let form: HTMLFormElement
    let dragover = false

    function remove() {
        dropzone.removeAllFiles()
        uploaded = ""
    }
</script>

<Require
    src="https://unpkg.com/dropzone@6.0.0-beta.1/dist/dropzone-min.js"
    css="https://unpkg.com/dropzone@6.0.0-beta.1/dist/dropzone.css"
    on:load={onload}
>
    Upload a file
    <form
        action="/dropzone-upload"
        class="dropzone"
        class:dragover
        bind:this={form}
        on:dragover={() => (dragover = true)}
        on:dragleave={() => (dragover = false)}
        on:drop={() => (dragover = false)}
    />
    Uploaded: {uploaded ?? "..."}
    {#if uploaded}
        <button class="btn btn-outline-info mt-2" on:click={remove}>
            Remove all files
        </button>
    {/if}
</Require>

<style>
    .dropzone:hover {
        border-width: 2px;
    }
    .dropzone.dragover {
        border-width: 2px;
        border-color: red;
    }
</style>
