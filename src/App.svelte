<script>
  import Counter from "./lib/Counter.svelte";
  import Nunjucks from "./lib/nunjucks/Nunjucks.svelte";
  const url = window.location.href;
</script>

<main>
  <div>
    <a href="https://esbuild.github.io/" target="_blank">
      <img
        src="https://esbuild.github.io/favicon.svg"
        class="logo"
        alt="ESbuild Logo"
      />
    </a>
    <a href="https://svelte.dev" target="_blank">
      <img src="/static/img/svelte.svg" class="logo svelte" alt="Svelte Logo" />
    </a>
    <a href="https://palletsprojects.com/p/flask/" target="_blank">
      <img
        src="https://flask.palletsprojects.com/en/2.2.x/_images/flask-logo.png"
        class="logo flask"
        alt="Flask Logo"
      />
    </a>
    <a href="getbootstrap.com" target="_blank">
      <img
        src="https://getbootstrap.com/docs/5.2/assets/brand/bootstrap-logo-shadow.png"
        class="logo bootstrap"
        alt="Bootstrap Logo"
      />
    </a>
  </div>
  <h1>ESBuild + Svelte + Flask + Bootstrap!</h1>
  <p>
    Current url is {url} and the path is {window.location.pathname}
  </p>
  <div class="card">
    <Counter count={48} />
  </div>

  <p class="read-the-docs">
    Click on the ESbuild and Svelte logos to learn more
  </p>

  <Nunjucks />
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
