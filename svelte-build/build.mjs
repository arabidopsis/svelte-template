import * as esbuild from "esbuild";
import sveltePlugin from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import dotenv from 'dotenv'
import { nunjucksImporterPlugin } from './nunjucks-plugin.mjs'
// grab e.g. TEMPLATE_FOLDER, ASSET_FOLDER from .env
dotenv.config({ path: '.env' })
const TEMPLATE_FOLDER = process.env.TEMPLATE_FOLDER || 'app/templates'
const production = process.env.NODE_ENV === 'production';
const watch = process.argv.includes('--watch')
//** @type {import('esbuild').BuildOptions} */
const baseconfig = {
  mainFields: ["svelte", "browser", "module", "main"],
  loader: { '.svg': 'dataurl' },
  // assetNames: 'public/assets/[name]-[hash]',
  bundle: true,
  charset: 'utf8',
  sourcemap: production,
  minify: production,
  target: 'es6',
  plugins: [sveltePlugin({ preprocess: [sveltePreprocess()] }), nunjucksImporterPlugin({ templateDir: TEMPLATE_FOLDER })],
  logLevel: "info",
  external: ['nunjucks', 'bootstrap']
}
async function build(config) {
  if (watch) {
    let ctx = await esbuild.context({ ...baseconfig, ...config })
    return await ctx.watch()
  }
  return esbuild.build({ ...baseconfig, ...config })
  //.catch(({error,location}) => { console.warn('Errors: ", error, location); process.exit(1)) }
}
export default build;
