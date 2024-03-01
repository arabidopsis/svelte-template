import * as esbuild from "esbuild"
// import path from 'path';
// import { fileURLToPath } from 'url';
import sveltePlugin from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import dotenv from 'dotenv'

import { nunjucksImporterPlugin } from './nunjucks-plugin.mjs'
import { libDirPlugin } from './libdir-plugin.mjs'
// grab e.g. TEMPLATE_FOLDER, ASSET_FOLDER etc. from .env
dotenv.config({ path: '.env' })
const templateDir = process.env.TEMPLATE_FOLDER || 'app/templates'
const libDir = process.env.LIB_DIR || 'src/lib'
const outdir = process.env.ASSET_FOLDER || 'app/static/assets'
const production = process.env.NODE_ENV === 'production';
const watch = process.argv.includes('--watch')

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
  plugins: [libDirPlugin(libDir), sveltePlugin({ preprocess: [sveltePreprocess({postcss:true})] }), nunjucksImporterPlugin({ templateDir: templateDir })],
  logLevel: "info",
  external: ['nunjucks', 'bootstrap'],
  outdir: outdir
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
