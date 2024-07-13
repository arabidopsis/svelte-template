// #!/usr/bin/env node
import build from "./build.mjs"
const blueprints = [
    "commands",
    "delay",
    "dropzone",
    "forms",
    "nunjucks",
    "plots",
]
Promise.all([
    build({ entryPoints: ["src/main.js"], outdir: process.env.ASSET_FOLDER }),
    ...blueprints.map((ep) =>
        build({
            entryPoints: [`app/blueprints/${ep}/src/${ep}.js`],
            // picked up by svelte_js(f'{ep}', f'{ep}.static') in template file
            outdir: `app/blueprints/${ep}/static/assets`,
        })
    ),
])
