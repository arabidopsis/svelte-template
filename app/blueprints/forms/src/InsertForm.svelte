<script context="module" lang="ts">
    import { scoped_delegate } from "$lib/delegates"
    import { mount, unmount, type Component } from "svelte"
    // importing this class!
    import InsertForm from "./InsertForm.svelte"
    let row: HTMLElement | null = null
    let current: Component | null = null
    const table = document.getElementById("stufftable")
    if (table) {
        const func = scoped_delegate(
            "tr[data-pubmed] > td",
            function (e: Event) {
                if (current !== null) {
                    unmount(current)
                    current = null
                }
                // console.log(self.parentNode);
                const tr = this.parentNode as HTMLElement
                if (tr === row || tr === null) {
                    row = null
                    return
                }
                row = tr
                const table = tr.parentNode as HTMLElement
                const anchor = (tr?.nextSibling as HTMLElement) || undefined
                const pubmed = tr.dataset.pubmed
                if (!table || !pubmed) return
                const colspan = tr.childElementCount
                current = mount(InsertForm, {
                    target: table,
                    anchor: anchor,
                    props: {
                        colspan: colspan,
                        pubmed: pubmed,
                    },
                })
            },
        )
        table.addEventListener("click", func)
    }
</script>

<script lang="ts">
    import Forms from "./Forms.svelte"

    type Props = {
        colspan: number
        pubmed: string
    }
    const { colspan, pubmed }: Props = $props()
</script>

<tr
    ><td {colspan} class="mx-auto"
        ><div class="form-div p-1"><Forms {pubmed} /></div></td
    ></tr
>

<style>
    :global(#stufftable > tbody > tr > td) {
        font-size: 1em;
        cursor: pointer;
    }
    .form-div {
        border: solid rgb(161, 83, 70) 1px;
        border-radius: .5rem;
    }
</style>
