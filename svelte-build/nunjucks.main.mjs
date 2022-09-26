import fs from 'fs'
import path from 'path';
import nunjucks from 'nunjucks'
import build from './build.mjs'
import { nunjucksOnLoadPlugin } from './nunjucks-plugin.mjs';

const PATH = 'app/templates/nunjucks'


await build({
    entryPoints: await fs.promises.readdir(PATH),
    outfile: 'app/static/assets/nunjucks-main.js',
    plugins: [nunjucksOnLoadPlugin(PATH)]

})





// const ret = nunjucks.precompile('app/templates/views/', { env: env, include: [/.*\.html/] });

// fs.writeFileSync('app/static/assets/nunjucks-main.js', ret)
