<script module lang="ts">
    // pnpm i -D @types/dropzone
    import type { DropzoneFile, DropzoneOptions } from "dropzone"
    declare global {
        var Dropzone: typeof Dropzone
    }
</script>

<script lang="ts">
    import Require from "$lib/Require.svelte"
    let dropzone: Dropzone
    let uploaded: string = $state('')
    let name: string
    const options: DropzoneOptions = {
        dictDefaultMessage: "Drop dem file here bro!",
    }
    function mydropzone(form:HTMLFormElement) {
        //setTimeout(() => Dropzone.discover(), 0)
        dropzone = new Dropzone(form, options)
        console.log(form, dropzone, window.Dropzone)
        dropzone.on("success", function (file: DropzoneFile, response: string) {
            console.log(file, response)
            uploaded = response
        })
        dropzone.on("addedfile", (file: File) => {
            name = file.name
            console.log(file.name, file)
        })
        form.classList.add('dropzone')
    }

    let dragover = $state(false)

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

>
    Upload a file
    <form
        action="/dropzone-upload"
        class:dragover
        use:mydropzone
        ondragover={() => (dragover = true)}
        ondragleave={() => (dragover = false)}
        ondrop={() => (dragover = false)}
        onchange={showchange}
    ></form>
    Uploaded: {uploaded ?? "..."}
    {#if uploaded}
        <button class="btn btn-outline-info mt-2" onclick={remove}>
            Remove all files
        </button>
    {/if}
</Require>

<style>
    .xdropzone:hover {
        border-color: green;
    }
    .xdropzone.dragover {
        border-color: orange;
    }
</style>
