<script context="module" lang="ts">
    // pnpm i -D @types/dropzone
    import type { DropzoneFile, DropzoneOptions } from "dropzone"
    declare global {
        var Dropzone: typeof Dropzone
    }
</script>

<script lang="ts">
    import Require from "$lib/Require.svelte"
    let dropzone: Dropzone
    let uploaded: string
    let name: string
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
        dropzone.on("addedfile", (file: File) => {
            name = file.name
            console.log(file.name, file)
        })
    }
    let form: HTMLFormElement
    let dragover = false

    function remove() {
        dropzone.removeAllFiles()
        uploaded = ""
    }
    function showchange() {
        // form.elements['file']
        // @ts-ignore
        console.log(form.elements["file"])
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
        on:change={showchange}
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
        border-color: green;
    }
    .dropzone.dragover {
        border-color: orange;
    }
</style>
