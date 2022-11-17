<script context="module" lang="ts">
  // generated in command.html page
  declare const Config: ConfigType;
</script>

<script lang="ts">
  import { tick } from "svelte";
  type State = "PENDING" | "DONE" | "STARTED" | "KILLED" | "CANCELLED";
  export let url: string = Config.url;
  export let maxHeight: number = 20;

  let logarea: HTMLElement;

  let logs: string[] = [];
  let currentState: State = "PENDING";
  let cancel = false;
  let pid: number = 0;
  let retcode: number | null = null;
  let error: string | null = null;

  function reset() {
    logs = [];
    currentState = "PENDING";
    cancel = false;
    pid = 0;
    retcode = null;
    error = null;
  }

  async function kill() {
    if (pid !== 0) {
      const res = await fetch(`${url}/kill/${pid}`);
      const txt = await res.text();
      if (txt === "KILLED") currentState = "KILLED";
    }
  }

  function run() {
    const es = new EventSource(url);
    es.addEventListener("message", async (event) => {
      const data: Message = JSON.parse(event.data);
      if (data === null || cancel) {
        if (currentState != "KILLED") {
          currentState = cancel ? "CANCELLED" : "DONE";
        }
        pid = 0;
        es.close();
      } else if (data.kind === "pid") {
        pid = data.pid;
      } else if (data.kind === "retcode") {
        retcode = data.retcode;
      } else if (data.kind === "line") {
        logs.push(data.line + "\n");
        logs = logs; // svelte signal
        await tick();
        // scroll to bottom
        logarea!.scrollTop = logarea!.scrollHeight;
        // logarea!.scroll({ top: logarea.scrollHeight, behavior: "smooth" });
      } else {
        error = data.msg;
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
  {#if pid !== 0}<code>PID:{pid}</code>{/if}
  {#if retcode !== null}
    <span class="r" class:retcode>retcode: {retcode}</span>
  {/if}
  {#if ["CANCELLED", "DONE", "KILLED"].includes(currentState)}
    <button class="btn btn-warning" on:click={reset}>Reset</button>
  {/if}
{/if}
<pre
  bind:this={logarea}
  class="build-log mt-1"
  style:max-height="{maxHeight}em"
  style:height="{maxHeight}em">{#each logs as log}{log}{/each}</pre>

<h3>status: <code>{currentState}</code> {error ? error : ""}</h3>

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
  .r {
    color: var(--bs-success, green);
  }
  .r.retcode {
    color: var(--bs-danger, red);
  }
</style>
