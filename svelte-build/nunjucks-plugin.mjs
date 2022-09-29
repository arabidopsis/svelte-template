import fs from 'fs'
import path from 'path';
import nunjucks from 'nunjucks'

export const nunjucksOnLoadPlugin = (baseDir) => {
    return {
        name: 'nunjucks',

        setup(build) {
            nunjucks.installJinjaCompat()
            const env = new nunjucks.configure();
            const filter = /\.html$/

            // REM: async filters must be known at compile-time

            build.onResolve({ filter: filter }, args => {
                return { path: path.join(args.resolveDir, baseDir, args.path) }
            })

            build.onLoad({ filter: filter }, async (args) => {
                const template = await fs.promises.readFile(args.path, { encoding: 'utf8' })
                // let ret = nunjucks.precompile(args.path, { name: path.basename(args.path), env: env, include: [filter] });
                let ret = nunjucks.precompileString(template, { name: path.basename(args.path), env: env, include: [filter] });

                return {
                    contents: ret,
                    loader: 'js',
                    watchDirs: [baseDir]
                }
            })
        },
    }
}
export const nunjucksImporterPlugin = (baseDir) => {
    function getname(fullname) {
        if (!baseDir) {
            return path.basename(fullname)
        }
        return path.relative(baseDir, fullname)
    }
    return {
        name: 'nunjucks-importer',

        setup(build) {
            nunjucks.installJinjaCompat()
            const env = nunjucks.configure();
            const filter = /\.html$/

            // REM: async filters must be known at compile-time

            build.onLoad({ filter: filter }, async (args) => {
                const template = await fs.promises.readFile(args.path, { encoding: 'utf8' })
                const ret = nunjucks.precompileString(template, { name: getname(args.path), env: env, include: [filter] });

                return {
                    contents: ret,
                    loader: 'js'
                }
            })
        },
    }
}
