import build from './build.mjs';

const result = await build({
    entryPoints: ["src/main.js"],
    outdir: process.env.ASSET_FOLDER,

})
