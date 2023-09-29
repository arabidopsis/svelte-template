import build from '../../../../svelte-build/build.mjs';
// npx node app/blueprints/commands/src/build.cmd.mjs -- --watch
const result = await build({
    entryPoints: ["app/blueprints/commands/src/cmd.js"],
    outdir: "app/blueprints/commands/static/assets"

})
