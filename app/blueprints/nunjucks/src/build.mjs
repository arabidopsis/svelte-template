import build from '../../../../svelte-build/build.mjs';
// npx node app/blueprints/nunjucks/src/build.mjs -- --watch
const result = await build({
    entryPoints: ["app/blueprints/nunjucks/src/nunjucks.js"],
    outdir: "app/blueprints/nunjucks/static/assets"

})
