import build from '../../../svelte-build/build.mjs';
// npx node app/commands/src/build.cmd.mjs -- --watch
const result = await build({
    entryPoints: ["app/commands/src/cmd.js"],
    outdir: "app/commands/static/assets"

})
