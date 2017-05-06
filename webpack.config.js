const path = require('path')

module.exports = {
  entry: './src/js/entry.js',
  output: {
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.webpack.js', '.js', '.ejs', '.css']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      },
    ]
  }
}
