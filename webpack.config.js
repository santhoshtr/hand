const path = require("path");

module.exports = {
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: {
          loader: "worker-loader",
          options: { inline: true }
        }
      }
    ]
  },
  output: {
    library: "HandwritingRecognition",
    libraryExport: "default",
    libraryTarget: "umd",
    filename: "handwriting-recognition.js",
    path: path.resolve(__dirname, "dist")
  },
  devtool: "source-map"
};
