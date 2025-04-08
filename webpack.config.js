const path = require("path")
const TerserPlugin = require("terser-webpack-plugin")

module.exports = {
  entry: "./src/Powiew.js",
  output: {
    filename: "powiew.min.js",
    path: path.resolve(__dirname, "dist"),
    library: "Powiew",
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
            plugins: ["@babel/plugin-proposal-class-properties"],
          },
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
  resolve: {
    extensions: [".js", ".json"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  mode: "production",
}
