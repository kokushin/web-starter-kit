const path = require('path')

module.exports = {
  entry: './src/js/import.js',
  output: {
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.css']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: ['babel-loader', 'eslint-loader'],
        exclude: /node_modules/
      },
    ]
  }
}
