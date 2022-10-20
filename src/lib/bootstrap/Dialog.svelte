<script type="ts">
    import { onMount } from "svelte";
    import bootstrap from "bootstrap";

    export let size: string = "xl";

    let dialog_dom: HTMLElement;
    let modal: bootstrap.Modal;
    onMount(() => {
        modal = new bootstrap.Modal(dialog_dom);
        return () => modal.dispose();
    });
    // onDestroy(() => modal.dispose());

    export function show() {
        modal.show();
    }
    export function hide() {
        modal.hide();
    }
    export function toggle() {
        modal.toggle();
    }
</script>

<div
    bind:this={dialog_dom}
    on:hide.bs.modal
    on:show.bs.modal
    class="modal fade"
    tabindex="-1"
    aria-hidden="true"
>
    <div class="modal-dialog modal-{size}">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    <slot name="title" />
                </h5>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                />
            </div>
            <div class="modal-body">
                <slot name="body" />
            </div>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">Close</button
                >
            </div>
        </div>
    </div>
</div>
