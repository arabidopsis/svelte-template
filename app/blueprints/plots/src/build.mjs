import build from '../../../../svelte-build/build.mjs';
// npx node app/blueprints/plots/src/build.mjs -- --watch
const result = await build({
    entryPoints: ["app/blueprints/plots/src/plots.js"],
    outdir: "app/blueprints/plots/static/assets",
    publicPath: '/plots/static/assets',     // from: static_url_path="/plots/static",
    loader: { '.svg': 'file' }
})
