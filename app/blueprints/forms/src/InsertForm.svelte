<script context="module" lang="ts">
    import { scoped_delegate } from "../../../../src/lib/delegates";
    // importing this class!
    import InsertForm from "./InsertForm.svelte";
    let row: HTMLElement | null = null;
    let current: InsertForm | null = null;
    const table = document.getElementById("stufftable");
    if (table) {
        const func = scoped_delegate("tr > td", function (e) {
            if (current !== null) {
                current.$destroy();
                current = null;
            }
            // console.log(self.parentNode);
            const tr = this.parentNode as HTMLElement;
            if (tr === row) {
                row = null;
                return;
            }
            row = tr;
            const table = tr?.parentNode as HTMLElement;
            const anchor = (tr?.nextSibling as HTMLElement) || undefined;
            const pubmed = tr?.dataset?.pubmed;
            if (!tr || !table || !pubmed) return;
            const colspan = tr.childElementCount;
            current = new InsertForm({
                target: table,
                anchor: anchor,
                props: {
                    colspan: colspan,
                    pubmed: pubmed,
                },
            });
        });
        table.addEventListener("click", func);
    }
</script>

<script lang="ts">
    import Forms from "./Forms.svelte";
    export let colspan: number;
    export let pubmed: string;
</script>

<tr><td {colspan} class="mx-auto"><div><Forms {pubmed} /></div></td></tr>

<style>
    tr > td > div {
        font-size: 1em;
        cursor: pointer;
    }
</style>
