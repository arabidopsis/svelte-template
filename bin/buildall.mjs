import build from '../svelte-build/build.mjs';
const blueprints=[ "commands", "delay","dropzone", "forms", "nunjucks", "plots"]
const entryPoints = blueprints.map( ep => `app/blueprints/${ep}/src/${ep}.js`)

await build({entryPoints, outbase:'app/blueprints'})
