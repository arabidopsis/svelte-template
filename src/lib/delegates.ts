// very much simplified version of jQuery delegate
// https://github.com/jquery/jquery/blob/main/src/event.js#L354


export function aselem(e: EventTarget): HTMLElement {
    return e as HTMLElement;
}
export class Delegate {
    readonly handlers: ((e: MouseEvent) => any)[];
    readonly selector: string;

    constructor(selector: string) {
        this.selector = selector;
        this.handlers = [];
        // check if selector is valid
        document.documentElement.querySelector(selector);
    }

    add(handler: (e: MouseEvent) => any): this {
        this.handlers.push(handler);
        return this;
    }
    // on:click={delegate.on}
    on = (e: MouseEvent): void => {
        if (e.currentTarget === null || this.handlers.length === 0) return
        const elems = aselem(e.currentTarget).querySelectorAll(
            this.selector
        );
        if (elems === null) return;
        for (let i = 0; i < elems.length; i++) {
            if (elems[i] === e.target) {
                this.handlers.forEach((handler) => {
                    // hanlder may be async so res is a Promise
                    // we can't stop propagation of an event from
                    // this type of function so we don't need to await it...
                    const res = handler.apply(e.target, [e]);
                    if (res === false) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
                break;
            }
        }
    };
}
// const func = delegate('.class ol li', (e) => {
//     /* do something with e.target */
// })
// <div on:click={func} >
//  {@html html}
// </div>
// **REM**: use :scope to scope to the childen e.g. ":scope > div"
// https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector#get_direct_descendants_using_the_scope_pseudo-class
export function delegate(selector: string, handler: (e: MouseEvent) => any) {
    // check that selector is valid
    document.documentElement.querySelector(selector);
    return function (e: MouseEvent) {
        if (e.currentTarget === null) return
        const elems = aselem(e.currentTarget).querySelectorAll(selector);
        if (elems === null) return;
        for (let i = 0; i < elems.length; i++) {
            if (elems[i] === e.target) {
                // hanlder may be async so res is a Promise
                // we can't stop propagation of an event from
                // this type of function so we don't need to await it...
                const res = handler.apply(e.target, arguments);
                if (res === false) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                break;
            }
        }
    };
}
export const scoped_delegate = (selector: string, handler: (e: MouseEvent) => any) => delegate(':scope ' + selector, handler)
