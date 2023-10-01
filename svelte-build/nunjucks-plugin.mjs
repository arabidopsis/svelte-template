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



export const nunjucksImporterPlugin = ({ templateDir = undefined, filter = /\.html$/ } = {}) => {

    // importing .html files into javascript/svelte here means
    // we are using a nunjucks template
    if (templateDir) {
        templateDir = path.resolve(templateDir)
    }
    function getname(fullname) {
        if (!templateDir) {
            return path.basename(fullname)
        }
        return path.relative(templateDir, fullname)
    }

    return {
        name: 'nunjucks',

        setup(build) {
            nunjucks.installJinjaCompat()
            const env = nunjucks.configure();

            if (templateDir) {
                build.onResolve({ filter: filter }, args => {
                    if (args.kind === "import-statement")
                        return { path: path.isAbsolute(args.path) ? args.path : path.join(templateDir, args.path) }
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
                    const dirname = templateDir ? templateDir : path.dirname(args.path)

                    ret = dependencies.map(name => importstr(path.join(dirname, name))).join("\n") + '\n' + ret
                }

                return {
                    contents: ret,
                    loader: 'js',
                    watchDirs: templateDir ? [templateDir] : [],
                    resolveDir: templateDir ? templateDir : undefined
                }
            })
        },
    }
}
