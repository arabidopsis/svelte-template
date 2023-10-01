export function isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
        (window.innerWidth || document.documentElement.clientWidth)
    );
}

export function scroll(elem: HTMLElement | null, block: ScrollLogicalPosition = "center"): void {
    if (elem) {
        if (!isInViewport(elem))
            elem.scrollIntoView({ block, inline: "nearest" });
    }
}

export function keepInView(
    elem: HTMLElement | null,
    viewport: HTMLElement | null
): void {
    if (elem && viewport) {
        const e = elem.getBoundingClientRect();
        const vp = viewport.getBoundingClientRect();
        const not_in_view = e.top > vp.bottom || e.bottom < vp.top;
        if (not_in_view) viewport.scrollTop += e.top - vp.top;
    }
}

export function wait(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function atend(elem: HTMLElement): boolean {
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
    return elem.scrollHeight - Math.round(elem.scrollTop) === elem.clientHeight
}
