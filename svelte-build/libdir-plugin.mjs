// If you change libDir here
// then you need to alter tsconfig.json:compilerOptions.paths too

// Map import Comp from '$lib/Comp.svelte
// to the src/lib directiory
export const libDirPlugin = ({ libDir = 'src/lib' } = {}) => {
    return {
        name: '$lib',
        setup(build) {
            build.onResolve({ filter: /^\$lib\// }, async (args) => {
                const path = args.path.slice(4)
                const result = await build.resolve('.' + path, {
                    kind: 'import-statement',
                    resolveDir: libDir,
                })
                if (result.errors.length > 0) {
                    return { errors: result.errors }
                }
                return { path: result.path }
            })
        },
    }
}
