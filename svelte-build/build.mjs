import esbuild from "esbuild";
import sveltePlugin from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";


const watch = process.env.WATCH === '1';
const production = process.env.PRODUCTION === '1';
const baseconfig = {
  mainFields: ["svelte", "browser", "module", "main"],
  loader: { '.svg': 'dataurl' },
  // assetNames: 'public/assets/[name]-[hash]',
  bundle: true,
  charset: 'utf8',
  sourcemap: true,
  watch: watch,
  minify: production,
  target: 'es6',
  plugins: [sveltePlugin({ preprocess: sveltePreprocess() })],
  logLevel: "info",
}
async function build(config) {
  return esbuild.build({ ...baseconfig, ...config })//.catch(() => process.exit(1))
}
export default build;
