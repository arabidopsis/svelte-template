import build from './build.mjs';
const result  = await build({
    entryPoints: ["src/main.js"],
    outdir: "public/assets",

})

