const html = await Bun.file("src/index.html").text();

const rw = new HTMLRewriter();
rw.on("link[rel=stylesheet]", {
  async element(el) {
    const href = el.getAttribute("href");
    if (!href) return;

    const style = await Bun.build({
      entrypoints: [`src/${href}`],
      minify: true,
      experimentalCss: true,
    }).then((bo) => bo.outputs[0].text());

    el.replace(`<style>${style.trim()}</style>`, { html: true });
  },
});
rw.on("script[src]", {
  async element(el) {
    const src = el.getAttribute("src");
    if (!src) return;

    const script = await Bun.build({
      entrypoints: [`src/${src}`],
      minify: true,
    }).then((bo) => bo.outputs[0].text());

    el.replace(`<script type="module">${script.trim()}</script>`, {
      html: true,
    });
  },
});

const minifiedHtml = rw.transform(html).replaceAll(/>\s+</g, "><");
Bun.write("dist/index.html", minifiedHtml);
