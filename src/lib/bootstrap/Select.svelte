<script lang="ts">
    import { createEventDispatcher } from "svelte"
    import Tags from "bootstrap5-tags"
    type Props = {
        options: string[]
    }
    const { options }: Props = $props()

    let selected: string[] = $state([])

    const dispatch = createEventDispatcher()

    function tags(node: HTMLSelectElement) {
        const tags = new Tags(node)
        return {
            destroy: () => {
                tags.dispose()
            },
        }
    }
    $effect(() => {
        dispatch("selected", Array.from(selected))
    })
    function change(this: HTMLSelectElement, e: Event) {
        selected = Array.from(this.selectedOptions)
            .filter((opt) => opt.selected)
            .map((opt) => opt.value)
    }
</script>

see <a href="https://github.com/lekoala/bootstrap5-tags">repo</a>
<select
    class="form-select"
    size="3"
    multiple
    use:tags
    data-badge-style="info"
    onchange={change}
>
    <option disabled hidden value="">Choose a tag...</option>
    {#each options as option (option)}
        <option value={option}>{option}</option>
    {/each}
</select>
<div class="invalid-feedback">Please select a valid tag.</div>
Selected:
{#each selected as s}
    <code class="selected m-1">{s}</code>
{/each}
