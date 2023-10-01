# Svelte + Flask + ESbuild + Bootstrap Template

-   [Svelte](https://svelte.dev/)
-   [Flask](https://flask.palletsprojects.com/)
-   [esbuild](https://esbuild.github.io)
    -   [esbuild plugins](https://github.com/esbuild/community-plugins)
    -   [getting started with esbuild](https://blog.logrocket.com/getting-started-esbuild/)
-   [Bootstrap](https://getbootstrap.com/)

The reason I like this setup is that I can create server side
templates using jinja2, generate server side html fragments using
jinja2 macros in the [HTML over the web way](https://hotwired.dev, https://qwik.builder.io/) (without the websockets :).
So creation of static and semi-static html pages is simple.
For limited interactivity I can add in [htmx](https://htmx.org) too.
And _also_ create an "app" with multiple target points per page, viz `src/main.js`.

Also, SvelteKit is awesome but I still need my backend to have access to
`sqlalchemy`/`pandas`/`pytorch`/`celery` etc. Maybe one day we will all be
using Rust/wasm but we are not there yet.

## To instantiate

run (see [degit](https://github.com/Rich-Harris/degit)):

```bash
# grab a copy of this repo
npx degit arabidopsis/svelte-template my-new-website
# *OR*
# git clone --depth=1 https://github.com/arabidopsis/svelte-template my-new-website && \
#     (cd my-new-website; rm -rf .git)
cd my-new-website
# install javascript dependencies
npm install

```

Now build all the javascript (see `bin/buildall`)

```bash
# optional...
export NODE_ENV=production
blueprints=(commands delay dropzone forms nunjucks plots)
npx node svelte-build/build.main.mjs
for b in ${blueprints[@]}; do
    npx node app/blueprints/$b/src/build.mjs
done
```

Now for the python. The dependencies are just `Flask`, `python-dotenv` and `toml`

```bash
# activate a suitable python
conda activate py39
# create an isolated virtual environment
python -m venv .venv
conda deactivate
# now activate the virtual environment
source .venv/bin/activate
# install python dependencies
poetry install --without=dev
# ** for development ** don't exclude dev
# pre-commit install

# run the flask app
flask run
```

You should have a fully running flask website.

### push new code to github

See [here](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/adding-locally-hosted-code-to-github).

First remove anything you don't want or need (e.g nunjucks).

```bash
# create a empty new repo {my-new-repo} on github. Then ...
git clone git@github.com:{user}/my-new-repo.git
# copy everything including hidden files
cp -rT /path/to/my-new-website/ my-new-repo/
cd my-new-repo
git add . && git commit -m "initial commit"
git push
```

## Compiling svelte and typscript

You can setup the build script anyway you want for example

```javascript
// mybuild.mjs
import build from "svelte-build/build.mjs"
await build({
    entryPoints: [
        "src/entrypoint1.js",
        "src/entrypoint2.js",
        // ...
    ],
})
```

`npx node mybuild.mjs` will create js/css files in `app/static/assets` which can then be
loaded using jinja functions `{{svelte_js('entrypoint1')}}` and `{{svelte_css('entrypoint1')}}`
in your templates. It's up to you if you put all your svelte code under src or spread
it out in the flask app. Take a look at `app/blueprints/{commands,delay}src/build.mjs` for
an idea to keep the client side code near the backend code that delivers it.

You only need to keep the svelte-build directory and the package.json file.

## Development

-   run `python -m app [--page=/]` to generate an `index.html` file from your flask templates
-   run `npm run serve` to run a [hot reloading server](https://www.npmjs.com/package/live-server)
-   then run (in another terminal) `npm run build -- --watch` to run a live (re)esbuild. Now editing (svelte/js/ts) files will prompt an immediate reload

You can also just run `flask run` instead of `npm run serve` but you
will have to refresh the page in the browser.

### Loading svelte bundles in flask

There are two global jinja2 functions `svelte_css` and `svelte_js` which
use an `ASSET_FOLDER = 'assets'` configuration value to load css and js generated
from the build process. Typically from the static folder. This should be the folder that the esbuild scripts specify e.g: `outdir: "app/static/assets"`.
If you change `ASSET_FOLDER` in python (`app/config.py`) then change the value in `.env` file
for `esbuild`.

Along with that there are `cdn_css` and `cdn_js` jinja2 functions that can be used to
reference css and javascript from CDNs specified in `app/cdn.toml`

## Usage

In some file such as `main.js`

```javascript
import "./app.css"
import App from "./App.svelte"
import AnotherApp from "./AnotherApp.svelte"
// target two places in the jinja template to run
// our apps.
export const app = new App({
    target: document.getElementById("app"),
})
export const another_app = new AnotherApp({
    target: document.getElementById("another-app"),
})
```

This, I think, gives me the best of both worlds.

Also `esbuild` allows me to create build scripts (see say: `svelte-build/build.main.mjs`)
to create multiple bundles, one for each page if necessary.

You can run jinja2 macros with e.g.:

```python
@app.route('/fragment/<dataid>')
def fragment(dataid:str) -> str:
  data = get_data(dataid)
  macros = current_app.jinja_env.get_template("macros.html")
  return macros.module.showdata(data)
```

And deal with them simply as

```html
<script>
    import { onMount } from "svelte"
    import { scoped_delegate } from "./lib/delegates"
    export let dataid = 0
    const monitor = scoped_delegate(
        "> div.withids  div[data-id]",
        async (e) => {
            const res = await fetch(`/fragment/${e.target.dataset.id}`)
            html = await res.text()
        }
    )
    let html = ""
    onMount(async () => {
        const res = await fetch(`/fragment/${dataid}`)
        html = await res.text()
    })
</script>

<div on:click="{monitor}">{@html html}</div>
```

## Nunjucks

There is also support for [nunjucks](https://mozilla.github.io/nunjucks/),
an implementation of the jinja2 templating engine in javascript. So
you can render jinja2 templates in the browser.

See comments in the `src/lib/nunjucks/Nunjucks.svelte` file.

## jQuery

To add jQuery as an external dependency with `{{cdn_js('jquery')}}` in the page template
just add

```bash
pnpm install -D  @types/jquery jquery
```
