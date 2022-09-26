<script>
    // this import (together with the nunjucksImporterPlugin)
    // means that the compiled template will be bundled with this code
    import "../../../app/templates/nunjucks/fragment.html";
    import { render as nunjucks } from "./nunjucks";

    let html = nunjucks("fragment.html", {
        somelist: [1, 2, 3, 5, 6],
        somestring: "nunjucks is great",
    });
</script>

{@html html}
