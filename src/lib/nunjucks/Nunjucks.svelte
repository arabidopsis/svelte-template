<script>
    import { render as nunjucks } from "./nunjucks";

    let html = nunjucks("fragment.html", {
        somelist: [1, 2, 3, 5, 6],
        somestring: "nunjucks is great",
    });
</script>


{@html html}

<p>
    Remember to compile the templates. Run <code>npm run numjucks</code>
    and look at the build script in <code>svelte/numjucks.main.mjs</code>.
</p>
