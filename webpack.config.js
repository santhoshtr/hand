const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    library: 'Mlhand',
    libraryExport: 'default',
    libraryTarget: 'umd',
    filename: 'mlhand.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map'
}
