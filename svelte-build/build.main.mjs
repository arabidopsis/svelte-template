import build from './build.mjs';
const result = await build({
    entryPoints: ["src/main.js"],
    outdir: "app/static/assets",

})

