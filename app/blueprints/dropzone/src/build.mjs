import build from '../../../../svelte-build/build.mjs';
// npx node app/blueprints/dropzone/src/build.mjs -- --watch
const result = await build({
    entryPoints: ["app/blueprints/dropzone/src/dropzone.js"],
    outdir: "app/blueprints/dropzone/static/assets"
})
