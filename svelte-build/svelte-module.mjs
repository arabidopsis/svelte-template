import { compileModule } from "svelte/compiler"
import { transform } from "esbuild"
import fs from "fs"
import path from "path"
async function convertMessage(
    { message, start, end },
    filename,
    source,
    sourcemap
) {
    let location
    if (start && end) {
        let lineText = source.split(/\r\n|\r|\n/g)[start.line - 1]
        let lineEnd = start.line === end.line ? end.column : lineText.length
        if (sourcemap) {
            sourcemap = new TraceMap(sourcemap)
            const pos = originalPositionFor(sourcemap, {
                line: start.line,
                column: start.column,
            })
            if (pos.source) {
                start.line = pos.line ?? start.line
                start.column = pos.column ?? start.column
            }
        }
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
const b64enc = Buffer
    ? (b) => Buffer.from(b).toString("base64")
    : (b) => btoa(encodeURIComponent(b))
function toUrl(data) {
    return "data:application/json;charset=utf-8;base64," + b64enc(data)
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
                if (filename.endsWith(".ts")) {
                    const {code, map} = await transform(
                        source,
                        {
                            loader: "ts",
                        }
                    )
                    source = code
                }
                let { js, _, warnings } = compileModule(source, {
                    generate: "client",
                    filename,
                })
                let contents =
                    js.code +
                    `
                //# sourceMappingURL=` +
                    toUrl(js.map.toString())
                return {
                    contents,
                    loader: "js",
                    warnings: await Promise.all(
                        warnings.map(
                            async (e) =>
                                await convertMessage(e, args.path, code, js.map)
                        )
                    ),
                }
            })
        },
    }
}
