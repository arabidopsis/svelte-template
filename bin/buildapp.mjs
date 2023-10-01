
// #!/usr/bin/env node
import build from '../svelte-build/build.mjs';
const blueprints=[ "commands", "delay","dropzone", "forms", "nunjucks", "plots"]
Promise.all(
    [
    build({entryPoints:['src/main.js'], outdir : process.env.ASSET_FOLDER}),
    ...blueprints.map(ep => build({
        entryPoints:[`app/blueprints/${ep}/src/${ep}.js`],
        outdir:`app/blueprints/${ep}/static/assets`}))
    ]
    )
