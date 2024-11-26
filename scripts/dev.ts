import type { ServeOptions } from "bun";
import fs from "node:fs";

const options: ServeOptions = {
  async fetch({ url }) {
    const path = new URL(url).pathname;

    switch (path) {
      case "/":
        return new Response(Bun.file("src/index.html"));
      case "/style.css":
        return new Response(Bun.file("src/style.css"));
      case "/script.ts":
        const script = await Bun.build({
          entrypoints: ["src/script.ts"],
        }).then((bo) => bo.outputs[0].text());
        return new Response(script, {
          headers: { "content-type": "application/javascript" },
        });
      default:
        return new Response("Not found", { status: 404 });
    }
  },
};

const server = Bun.serve(options);
console.log(`Server started at ${server.url}`);

fs.watch("src", () => {
  server.reload(options);
  console.log("Reloaded");
});
