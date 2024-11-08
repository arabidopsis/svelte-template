// #!/usr/bin/env node
import build from "./build.mjs"

Promise.all([
    build({ entryPoints: ["src/main.js"], outdir: process.env.ASSET_FOLDER }),
])
