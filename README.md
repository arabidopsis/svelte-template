
# Svelte + Flask + ESbuild Template

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
