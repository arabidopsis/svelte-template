<script context="module" lang="ts">
    import { scoped_delegate } from "$lib/delegates"
    import { mount, unmount, type Component } from "svelte"
    // importing this class!
    import InsertForm from "./InsertForm.svelte"
    export function clearForm() {
        if (current !== null) {
            unmount(current)
            current = null
        }
    }
    export function setEndpoint(ep: string) {
        endpoint = ep
    }
    export function setTableId(tableid: string) {
        if (table && func) {
            table.removeEventListener("click", func)
        }
        if (current) {
            unmount(current)
            current = null
        }
        table = document.getElementById(tableid)
        if (table) {
            func = enable()
            table.addEventListener("click", func)
        }
    }

    let endpoint: string = "noendpoint" // endpoint to send form...
    let row: HTMLElement | null = null
    let current: any | null = null
    let table: HTMLElement | null = null
    let func: any | null = null

    function enable() {
        return scoped_delegate("tr[data-pubmed] > td", function (e: Event) {
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
                    endpoint: endpoint,
                },
            })
        })
    }
</script>

<script lang="ts">
    import Forms from "./Forms.svelte"

    type Props = {
        colspan: number
        pubmed: string
        endpoint: string
    }
    const { colspan, pubmed, endpoint }: Props = $props()
    let open = $state(true)
</script>

{#if open}
    <tr
        ><td {colspan} class="mx-auto"
            ><div class="form-div p-1">
                <button
                    class="btn btn-sm btn-outline-warning float-end"
                    onclick={() => (open = false)}
                >
                    Close
                </button>
                <Forms {pubmed} {endpoint} />
            </div></td
        ></tr
    >
{/if}

<style>
    :global(#stufftable > tbody > tr > td) {
        font-size: 1em;
        cursor: pointer;
    }
    .form-div {
        border: solid rgb(161, 83, 70) 1px;
        border-radius: 0.5rem;
    }
</style>
