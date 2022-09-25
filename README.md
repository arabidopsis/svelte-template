
# Svelte + Flask + ESbuild Template

The reason I like this setup is that I can create server side
templates using jinja2, generate server side html fragments using
jinja2 macros in the [HTML over the web way](https://hotwired.dev).
So creation of static and semi-static html pages is simple.
And *also* create an "app" with multiple target points per page, viz `main.js`:

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
to create multiple bundles.

## To instantiate

cd to this directory and run:

```bash
# install javascript dependencies
npm install
# build the code
npm run build
# activate a suitable python
conda activate py39
# create an isolated virtual environ
python -m venv .venv
conda deactivate
source .venv/bin/activate
# install python dependencies
poetry install
# ** for development **
# pre-commit install
flask run # to run the flask app
```
## Development

* run `npm run serve` to run a [hot reloading server](https://www.npmjs.com/package/live-server) or `flask run`
* run `npm run build-watch` to run a live esbuild
