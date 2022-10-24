import fs from 'fs'
import path from 'path';
import nunjucks from 'nunjucks'

function* template(node) {
    // find all {% includes  "deps.html" %}
    if (node.template) {
        yield node.template.value;
    }
    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            yield* template(node.children[i])
        }
    }
}
function find_template_dependencies(src) {
    const node = nunjucks.parser.parse(src)
    return Array.from(new Set(template(node)))
}

function importstr(path) {
    return `import ${JSON.stringify(path)};`
}

export const nunjucksImporterPlugin = (baseDir = null, filter = /.html$/) => {
    // importing .html files into javascript/svelte here means
    // we are using a nunjucks template
    if (baseDir) {
        baseDir = path.resolve(baseDir)
    }
    function getname(fullname) {
        if (!baseDir) {
            return path.basename(fullname)
        }
        return path.relative(baseDir, fullname)
    }

    return {
        name: 'nunjucks',

        setup(build) {
            nunjucks.installJinjaCompat()
            const env = nunjucks.configure();

            if (baseDir) {
                build.onResolve({ filter: filter }, args => {
                    return { path: path.isAbsolute(args.path) ? args.path : path.join(baseDir, args.path) }
                })
            }
            // REM: async filters must be known at compile-time

            build.onLoad({ filter: filter }, async (args) => {
                const template = await fs.promises.readFile(args.path, { encoding: 'utf8' })

                let ret = nunjucks.precompileString(template, { name: getname(args.path), env: env });
                const dependencies = find_template_dependencies(template)

                if (dependencies.length > 0) {
                    // add import statements to top of js
                    // so they will be loaded too..
                    const dirname = baseDir ? baseDir : path.dirname(args.path)

                    ret = dependencies.map(name => importstr(path.join(dirname, name))).join("\n") + '\n' + ret
                }

                return {
                    contents: ret,
                    loader: 'js',
                    watchDirs: baseDir ? [baseDir] : []
                }
            })
        },
    }
}
