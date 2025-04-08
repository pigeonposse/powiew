const path = require("path")

module.exports = {
  entry: "./src/OmniVis.js",
  output: {
    filename: "OmniVis.js",
    path: path.resolve(__dirname, "dist"),
    library: "OmniVis",
    libraryTarget: "umd",
    globalObject: "this",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
}
