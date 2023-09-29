<script context="module">
    import { env, render as render_template } from "$lib/nunjucks/nunjucks"
    env.addGlobal("NUNJUCKS", "https://mozilla.github.io/nunjucks/")
    // also env.addFilter(name, func)
</script>

<script>
    // Remember to add `{{cdn_js('nunjucks-slim')}}` to your template file.

    // This import (together with the nunjucksImporterPlugin)
    // means that the compiled template (and dependencies) will be bundled with this code.
    // The filename is relative to template folder (see TEMPLATE_FOLDER in  the .env file)

    import "nunjucks/fragment.html"

    let html = render_template("nunjucks/fragment.html", {
        somelist: [1, 2, 3, 5, 6],
        somestring: "nunjucks is great",
    })
</script>

{@html html}
