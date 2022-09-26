// NOTE: either use the import here
// *OR* use the CDN `{{cdn_js('nunjucks-slim')}}` in the jinja2 template
// Remember to run `npm run nunjucks` to compile the templates!
// *and* include them in the template
// {{nunjucks_js('main')}}


// import nunjucks from 'nunjucks/browser/nunjucks-slim'
nunjucks.installJinjaCompat()
const env = nunjucks.configure();

env.addGlobal('NUNJUCKS', "https://mozilla.github.io/nunjucks/")
env.addFilter('split', function (s, match) {
    match = match ? match : /\s+/g;
    if (s) return s.split(match);
    return [];
});
export function nunjucks_render(id, template, content) {
    const elem = document.getElementById(id)
    if (elem === null) return
    const html = nunjucks.render(template, content)
    elem.innerHTML = html
}

export function render(template, context) {
    return nunjucks.render(template, context)
}
