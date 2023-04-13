import path from 'path'
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

nunjucks.installJinjaCompat()



export default function nunjucksImporterPlugin({ templateDir = undefined, filter = /\.html$/ } = {}) {

    const env = nunjucks.configure();
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
        name: 'vite-plugin-nunjucks',
        transform(src, id) {

            if (!filter.test(id)) return

            id == path.resolve(id)


            let ret = nunjucks.precompileString(src, { name: getname(id), env: env });
            const dependencies = find_template_dependencies(src)

            if (dependencies.length > 0) {
                // add import statements to top of js
                // so they will be loaded too..
                const dirname = templateDir ? templateDir : path.dirname(id)

                ret = dependencies.map(name => importstr(path.join(dirname, name))).join("\n") + '\n' + ret
            }

            return {
                code: ret,
                map: null
            }

        },
    }
}
