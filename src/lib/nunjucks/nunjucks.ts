// NOTE: nunjucks is marked as "external" so
// use the CDN `{{cdn_js('nunjucks-slim')}}` in the jinja2 template

// can't include this since we would need 'requirejs' for no real reason
// import nunjucks from 'nunjucks'
declare const nunjucks: Nunjucks

type Environment = {
    render: (template: string, content: any, func?: any) => string;
    addGlobal(name: string, value: any): void;
    addFilter(name: string, filter: (...args: any[]) => any, async?: boolean): void;

}
interface Nunjucks {
    installJinjaCompat: () => void
    Environment: new () => Environment
}


nunjucks.installJinjaCompat()
const env = new nunjucks.Environment();

env.addGlobal('NUNJUCKS', "https://mozilla.github.io/nunjucks/")
env.addFilter('split', function (s: string, match: string | RegExp): string[] {
    match = match ? match : /\s+/g;
    if (s) return s.split(match);
    return [];
});
export function nunjucks_render(id: string, template: string, content: Record<string, any>): string {
    const elem = document.getElementById(id)
    if (elem === null) return
    const html = env.render(template, content)
    elem.innerHTML = html
}

export function render(template: string, content: Record<string, any>): string {
    return env.render(template, content)
}

export function arender(template: string, content: Record<string, any>): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        //upload the file, then call the callback with the location of the file
        env.render(template, content, (err: any, res: string) => {
            if (!err) {
                resolve(res)
            } else {
                reject(err)
            }
        })
    })


}
