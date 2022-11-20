import build from '../../../../svelte-build/build.mjs';
// npx node app/blueprints/delay/src/build.delay.mjs -- --watch
const result = await build({
    entryPoints: ["app/blueprints/delay/src/delay.js"],
    outdir: "app/blueprints/delay/static/assets"

})
