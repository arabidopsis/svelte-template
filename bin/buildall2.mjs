
// #!/usr/bin/env node
import build from '../svelte-build/build.mjs';
const blueprints=[ "commands", "delay","dropzone", "forms", "nunjucks", "plots"]
// put all output files in the same assets directory
Promise.all(
    [build({entryPoints:['src/main.js']}),
    ...blueprints.map(ep => build({entryPoints:[`app/blueprints/${ep}/src/${ep}.js`]}))]
    )
