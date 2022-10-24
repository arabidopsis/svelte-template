<script>
    // remember to add `{{cdn_js('nunjucks-slim')}}` to your template file
    // this import (together with the nunjucksImporterPlugin)
    // means that the compiled template (and dependencies) will be bundled with this code

    import "../../../app/templates/nunjucks/fragment.html";
    import { render as nunjucks } from "./nunjucks";

    let html = nunjucks("fragment.html", {
        somelist: [1, 2, 3, 5, 6],
        somestring: "nunjucks is great",
    });
</script>

{@html html}
