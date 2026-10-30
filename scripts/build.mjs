import { build } from "esbuild"

const common = { bundle: true, sourcemap: true, logLevel: "info" }

// ESM / CJS for bundlers: d3 and three stay external (installed by the consumer)
const external = ["d3", "three", "three/*"]
await build({ ...common, entryPoints: ["src/powiew.js"], format: "esm", outfile: "dist/powiew.esm.js", external })
await build({ ...common, entryPoints: ["src/powiew.js"], format: "cjs", outfile: "dist/powiew.cjs", external })

// Browser <script>: everything bundled, global `Powiew`; Chart.js stays a global peer
await build({
  ...common,
  entryPoints: ["src/umd-entry.js"],
  format: "iife",
  globalName: "__PowiewNS",
  footer: { js: "if(typeof window!=='undefined'){window.Powiew=__PowiewNS.default}" },
  minify: true,
  outfile: "dist/powiew.min.js",
})
