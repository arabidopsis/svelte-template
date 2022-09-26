import fs from 'fs'
import path from 'path';
import nunjucks from 'nunjucks'

export const nunjucksOnLoadPlugin = (directory) => {
    return {
        name: 'nunjucks',

        setup(build) {
            nunjucks.installJinjaCompat()
            const env = new nunjucks.configure();
            const filter = /\.html$/

            // REM: async filters must be known at compile-time

            build.onResolve({ filter: filter }, args => {
                return { path: path.join(args.resolveDir, directory, args.path) }
            })

            build.onLoad({ filter: filter }, async (args) => {
                const template = await fs.promises.readFile(args.path, { encoding: 'utf8' })
                // let ret = nunjucks.precompile(args.path, { name: path.basename(args.path), env: env, include: [filter] });
                let ret = nunjucks.precompileString(template, { name: path.basename(args.path), env: env, include: [filter] });

                return {
                    contents: ret,
                    loader: 'js',
                    watchDirs: [directory]
                }
            })
        },
    }
}
