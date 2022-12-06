import build from '../../../../svelte-build/build.mjs';
// npx node app/blueprints/plots/src/build.plots.mjs -- --watch
const result = await build({
    entryPoints: ["app/blueprints/nunjucks/src/nunjucks.js"],
    outdir: "app/blueprints/nunjucks/static/assets"

})
