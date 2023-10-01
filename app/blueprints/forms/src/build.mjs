import build from '../../../../svelte-build/build.mjs';
// npx node app/blueprints/forms/src/build.mjs -- --watch
const result = await build({
    entryPoints: ["app/blueprints/forms/src/forms.js"],
    outdir: "app/blueprints/forms/static/assets"

})
