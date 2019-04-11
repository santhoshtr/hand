const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    library: 'HandwritingRecognition',
    libraryExport: 'default',
    libraryTarget: 'umd',
    filename: 'handwriting-recognition.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map'
}
