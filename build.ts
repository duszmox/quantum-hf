import tailwind from "bun-plugin-tailwind";
import { rm } from "node:fs/promises";
import path from "node:path";

const outdir = path.join(process.cwd(), "dist");
await rm(outdir, { recursive: true, force: true });

const entrypoints = [...new Bun.Glob("src/**/*.html").scanSync()];

const result = await Bun.build({
  entrypoints,
  outdir,
  plugins: [tailwind],
  minify: true,
  target: "browser",
  format: "iife",
  sourcemap: "linked",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});

for (const output of result.outputs) {
  if (!output.path.endsWith(".html")) continue;
  const html = await Bun.file(output.path).text();
  await Bun.write(
    output.path,
    html
      .replace(/<script type="module" crossorigin src=/g, "<script defer src=")
      .replace(/<link rel="stylesheet" crossorigin href=/g, '<link rel="stylesheet" href='),
  );
}

for (const output of result.outputs) {
  console.log(` ${path.relative(process.cwd(), output.path)}  ${(output.size / 1024).toFixed(1)} KB`);
}
