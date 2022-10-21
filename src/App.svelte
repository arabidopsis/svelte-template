<script>
  // @ts-ignore
  import svelteLogo from "../app/static/img/svelte.svg";
  import Counter from "./lib/Counter.svelte";
  // import Nunjucks from "./lib/nunjucks/Nunjucks.svelte";
  const url = window.location.href;
</script>

<main>
  <div>
    <a href="https://esbuild.github.io/" target="_blank" rel="noreferrer">
      <img
        src="https://esbuild.github.io/favicon.svg"
        class="logo"
        alt="ESbuild Logo"
      />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
    <a
      href="https://palletsprojects.com/p/flask/"
      target="_blank"
      rel="noreferrer"
    >
      <img
        src="https://flask.palletsprojects.com/en/2.2.x/_static/flask-icon.png"
        class="logo flask"
        alt="Flask Logo"
      />
    </a>
    <a href="getbootstrap.com" target="_blank" rel="noreferrer">
      <img
        src="https://getbootstrap.com/docs/5.2/assets/brand/bootstrap-logo-shadow.png"
        class="logo bootstrap"
        alt="Bootstrap Logo"
      />
    </a>
    <a href="https://fontawesome.com/" target="_blank" rel="noreferrer">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Font_Awesome_logomark_blue.svg"
        class="logo fontawesome"
        alt="FontAwesome Logo"
      />
    </a>
  </div>
  <h2>ESBuild + Svelte + Flask + Bootstrap + FontAwesome!</h2>
  <p>
    <code>&lt;Counter count=&lcub;0&rcub;&gt;</code>
  </p>
  <div class="card w-25 mx-auto">
    <Counter count={0} />
  </div>

  <p class="read-the-docs">
    Click on the ESbuild/Svelte/Flask/Bootstrap or FontAwesome logos to learn
    more
  </p>
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
