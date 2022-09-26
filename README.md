
# Svelte + Flask + ESbuild + Bootstrap Template

* [Svelte](https://svelte.dev/)
* [Flask](https://flask.palletsprojects.com/)
* [esbuild](https://esbuild.github.io)
  * [esbuild plugins](https://github.com/esbuild/community-plugins)
  * [getting started with esbuild](https://blog.logrocket.com/getting-started-esbuild/)
* [Bootstrap](https://getbootstrap.com/)

The reason I like this setup is that I can create server side
templates using jinja2, generate server side html fragments using
jinja2 macros in the [HTML over the web way](https://hotwired.dev) (without the websockets :).
So creation of static and semi-static html pages is simple.
And *also* create an "app" with multiple target points per page, viz `main.js`:


## To instantiate

run (see [degit](https://github.com/Rich-Harris/degit)):

```bash
# grab a copy of this repo
degit arabidopsis/svelte-template my-new-website
# *OR*
# git clone --depth=1 https://github.com/arabidopsis/svelte-template my-new-website && \
#     (cd my-new-website; rm -rf .git)
cd my-new-website
# install javascript dependencies
npm install
# build the code
npm run build
# activate a suitable python
conda activate py39
# create an isolated virtual environment
python -m venv .venv
conda deactivate
# now activate the virtual environment
source .venv/bin/activate
# install python dependencies
poetry install
# ** for development **
# pre-commit install
# run the flask app
flask run
```

### push new code to github

See [here](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/adding-locally-hosted-code-to-github).

```bash
# create a new repo
git init -b main
git add . && git commit -m "initial commit"

# Create a repo on github.com called my-new-website.

# To avoid errors, do not initialize the new repository with README, license, or gitignore
# files. You can add these files after your project has been pushed to GitHub.
git remote add origin git@github.com:user/my-new-website.git
git remote -v
git push -u origin main
```
## Development

* run `python -m app` to generate an `index.html` file from your flask templates
* run `npm run serve` to run a [hot reloading server](https://www.npmjs.com/package/live-server) or `flask run`
* then run (in another terminal) `npm run build-watch` to run a live esbuild


### Loading svelte bundles

There are two global jinja2 functions `svelte_css` and `sevlte_js` which
use an `ASSET_FOLDER = 'assets` configuration value to load css and js generated
from the build process. Typically from the static folder. This should be the folder that the esbuild scripts specify e.g: `outdir: "app/static/assets"`

Along with that there are `cdn_css` and `cdn_js` that can be used to
reference css and javascript from CDNs specified in `app/cdn.toml`


## Usage

In some file such as `main.js`

```javascript
import './app.css'
import App from './App.svelte'
import AnotherApp from './AnotherApp.svelte'
// target two places in the jinja template to run
// our apps.
export const app = new App({
  target: document.getElementById('app')
})
export const another_app = new AnotherApp({
  target: document.getElementById('another-app')
})

```
This, I think, gives me the best of both worlds.

Also `esbuild` allows me to create build scripts (see `svelte-build/build.main.mjs`)
to create multiple bundles, one for each page if necessary.

You can run jinja2 macros with:

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
  import {onMount} from 'svelte'
  import {scoped_delegate} from './lib/delegates'
  export let dataid = 0
  const monitor = scoped_delegate('> div.withids  div[data-id]', async (e) => {
      const res = await fetch(`/fragment/${e.target.dataset.id}`)
      html = await res.text()
  })
  let html = ''
  onMount(async () => {
    const res = await fetch(`/fragment/${dataid}`)
    html = await res.text();
  })
</script>

<div on:click={monitor}>
  {@html html}
</div>
```

### nunjucks

* https://mozilla.github.io/nunjucks/

```jinja

{{ cdn_js("nunjucks") }}
<script>
const env = nunjucks.configure();
const template = nunjucks.compile(`{{ include_raw("circos-info.html")}}`, env)

const html = template.render(json)
</script>
```
