// very much simplified version of jQuery delegate
// https://github.com/jquery/jquery/blob/main/src/event.js#L354

export function aselem(e: EventTarget): HTMLElement {
    return e as HTMLElement
}
export class Delegate {
    readonly handlers: ((e: MouseEvent) => any)[]
    readonly selector: string

    constructor(selector: string) {
        this.selector = selector
        this.handlers = []
        // check if selector is valid
        document.documentElement.querySelector(selector)
    }

    add(handler: (e: MouseEvent) => any): this {
        this.handlers.push(handler)
        return this
    }
    // on:click={delegate.on}
    on = (e: MouseEvent): void => {
        if (e.currentTarget === null || this.handlers.length === 0) return
        const elems = aselem(e.currentTarget).querySelectorAll(this.selector)
        if (elems === null) return
        const target = e.target as HTMLElement
        if (target === null) return
        for (let i = 0; i < elems.length; i++) {
            if (elems[i] === target || elems[i].contains(target)) {
                this.handlers.forEach((handler) => {
                    // handler may be async so res is a Promise
                    // we can't stop propagation of an event from
                    // this type of function so we don't need to await it...
                    const res = handler.apply(elems[i], [e])
                    if (res === false) {
                        e.preventDefault()
                        e.stopPropagation()
                    }
                })
                break
            }
        }
    }
}
// const func = delegate('.class ol li', function(e)  {
//     /* do something with e.target === this */
// })
// <div on:click|capture={func} >
//  {@html html}
// </div>
// **REM**: use :scope to scope to the childen e.g. ":scope > div"
// https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector#get_direct_descendants_using_the_scope_pseudo-class
// https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function
export function delegate<T>(
    selector: string,
    handler: (this: HTMLElement, e: MouseEvent, ...args: T[]) => any,
    ...args: T[]
) {
    // check that selector is valid
    document.documentElement.querySelector(selector)
    return function (e: MouseEvent) {
        if (e.currentTarget === null) return
        const elems = aselem(e.currentTarget).querySelectorAll(selector)
        if (elems === null) return
        const target = e.target as HTMLElement
        if (target === null) return
        for (let i = 0; i < elems.length; i++) {
            if (elems[i] === target || elems[i].contains(target)) {
                // handler may be async so res is a Promise
                // we can't stop propagation of an event from
                // this type of function so we don't need to await it...
                const res = handler.apply(elems[i] as HTMLElement, [e, ...args])
                if (res === false) {
                    e.preventDefault()
                    e.stopPropagation()
                }
                break
            }
        }
    }
}
export const scoped_delegate = <T>(
    selector: string,
    handler: (this: HTMLElement, e: MouseEvent) => any,
    ...args: T[]
) => delegate<T>(":scope " + selector, handler, ...args)
