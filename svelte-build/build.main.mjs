import build from './build.mjs';
// multiple entry points will generate multiple
// outputfiles in ASSET_FOLDER
const result = await build({
    entryPoints: ["src/main.js"],
    outdir: process.env.ASSET_FOLDER,

})
