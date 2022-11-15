<script lang="ts">
  import { tick } from "svelte";
  let logarea: HTMLElement;
  let logs: string[] = [];
  let currentState: string = "PENDING";
  let cancel = false;
  export let url: string = "/runcommand";
  export let maxHeight: number = 200;

  function run() {
    const es = new EventSource(url);
    es.addEventListener("message", async (event) => {
      const data = JSON.parse(event.data);
      if (data === null || cancel) {
        currentState = cancel ? "CANCELLED" : "DONE";
        es.close();
      } else {
        logs = [...logs, data.msg];
        await tick();
        // scroll to bottom
        logarea!.scrollTop = logarea!.scrollHeight;
        // logarea!.scroll({ top: logarea.scrollHeight, behavior: "smooth" });
      }
    });
    currentState = "STARTED";
  }
</script>

{#if currentState == "PENDING"}
  <button class="btn btn-info" on:click={run}>Start Process</button>
{:else}
  <button
    class="btn btn-primary"
    on:click={() => (cancel = true)}
    disabled={currentState !== "STARTED"}>Stop Process</button
  >
  <pre
    bind:this={logarea}
    class="build-log mt-1"
    style:max-height="{maxHeight}px">{logs.join("\n")}</pre>
{/if}

<h3>status: {currentState}</h3>

<style>
  .build-log {
    overflow: auto;
    width: 100%;
    background-color: white;
    padding: 0.5em;
    margin: 0 auto;
    border: solid black 1px;
  }
  h3 {
    text-align: center;
  }
</style>
