const fs = require("fs")
const path = require("path")
const webpack = require("webpack")
const config = require("../webpack.config.js")

// Ensure the public/dist directory exists
const publicDistDir = path.resolve(__dirname, "../public/dist")
if (!fs.existsSync(publicDistDir)) {
  fs.mkdirSync(publicDistDir, { recursive: true })
}

// Ensure the examples directory exists in public
const publicExamplesDir = path.resolve(__dirname, "../public/examples")
if (!fs.existsSync(publicExamplesDir)) {
  fs.mkdirSync(publicExamplesDir, { recursive: true })
}

// Copy example.js to public/examples
const exampleSrc = path.resolve(__dirname, "../examples/example.js")
const exampleDest = path.resolve(publicExamplesDir, "example.js")
fs.copyFileSync(exampleSrc, exampleDest)

// Run webpack to build the library
webpack(config, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error("Build failed:", err || stats.toString())
    process.exit(1)
  }

  console.log("Library built successfully")

  // Copy the built library to public/dist
  const libSrc = path.resolve(__dirname, "../dist/powiew.min.js")
  const libDest = path.resolve(publicDistDir, "powiew.min.js")

  if (fs.existsSync(libSrc)) {
    fs.copyFileSync(libSrc, libDest)
    console.log("Library copied to public/dist")
  } else {
    console.error("Built library not found at", libSrc)
    process.exit(1)
  }
})
