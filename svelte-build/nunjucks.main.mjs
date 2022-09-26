import fs from 'fs'
import build from './build.mjs'
import { nunjucksOnLoadPlugin } from './nunjucks-plugin.mjs';

const PATH = 'app/templates/nunjucks'


await build({
    entryPoints: await fs.promises.readdir(PATH),
    outfile: 'app/static/assets/nunjucks-main.js',
    plugins: [nunjucksOnLoadPlugin(PATH)]

})
