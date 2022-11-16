<script lang="ts">
  import { tick } from "svelte";

  export let url: string = "/runcommand";
  export let maxHeight: number = 20;

  let logarea: HTMLElement;

  let logs: string[] = [];
  let currentState: string = "PENDING";
  let cancel = false;
  let pid: number = 0;

  function reset() {
    logs = [];
    currentState = "PENDING";
    cancel = false;
    pid = 0;
  }

  async function kill() {
    if (pid !== 0) {
      const res = await fetch(`${url}/kill/${pid}`);
      const txt = await res.text();
      currentState = txt;
    }
  }

  function run() {
    const es = new EventSource(url);
    es.addEventListener("message", async (event) => {
      const data = JSON.parse(event.data);
      if (data === null || cancel) {
        currentState = cancel ? "CANCELLED" : "DONE";
        pid = 0;
        es.close();
      } else if (data.pid) {
        pid = data.pid;
      } else {
        logs.push(data.msg + "\n");
        logs = logs; // svelte signal
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
  <button
    class="btn btn-danger"
    on:click={kill}
    disabled={currentState !== "STARTED"}>Kill Process</button
  >
  {#if pid !== 0}PID:{pid}{/if}
  {#if ["CANCELLED", "DONE"].includes(currentState)}
    <button class="btn btn-warning" on:click={reset}>Reset</button>
  {/if}
{/if}
<pre
  bind:this={logarea}
  class="build-log mt-1"
  style:max-height="{maxHeight}em"
  style:height="{maxHeight}em">{#each logs as log}{log}{/each}</pre>

<h3>status: <code>{currentState}</code></h3>

<style>
  .build-log {
    overflow: auto;
    width: 100%;
    background-color: black;
    color: lightgreen;
    font-weight: bold;
    padding: 0.5em;
    margin: 0 auto;
    border: solid black 1px;
  }
  h3 {
    text-align: center;
  }
</style>
