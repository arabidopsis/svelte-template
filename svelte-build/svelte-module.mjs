import { compileModule } from "svelte/compiler"
import { transform } from "esbuild"
import fs from "node:fs"
import path from "node:path"
// see https://github.com/EMH333/esbuild-svelte/blob/main/index.ts
// https://esbuild.github.io/plugins/#svelte-plugin
function convertMessage({ message, start, end }, filename, source) {
    let location
    if (start && end) {
        let lineText = source.split(/\r\n|\r|\n/g)[start.line - 1]
        let lineEnd = start.line === end.line ? end.column : lineText.length
        location = {
            file: filename,
            line: start.line,
            column: start.column,
            length: lineEnd - start.column,
            lineText,
        }
    }
    return { text: message, location }
}

export const svelteModulePlugin = ({ filter = /\.svelte\.(js|ts)$/ } = {}) => {
    // deal with .svelte.js and .svelte.ts files
    return {
        name: "svelte-modules",

        setup(build) {
            build.onLoad({ filter: filter }, async (args) => {
                let source = await fs.promises.readFile(args.path, {
                    encoding: "utf8",
                })
                const filename = path.relative(process.cwd(), args.path)
                try {
                    if (filename.endsWith(".ts")) {
                        const { code, map } = await transform(source, {
                            loader: "ts",
                        })
                        source = code
                    }
                    const { js, warnings } = compileModule(source, {
                        generate: "client",
                        filename,
                    })
                    const contents =
                        js.code + `\n//# sourceMappingURL=` + js.map.toUrl()
                    return {
                        contents,
                        loader: "js",
                        warnings: warnings.map((e) =>
                            convertMessage(e, filename, source)
                        ),
                    }
                } catch (e) {
                    return { errors: [convertMessage(e, filename, source)] }
                }
            })
        },
    }
}
