const path = require('path');

module.exports = {
  entry: './src/js/imports.js',
  output: {
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.ejs', '.scss', '.css']
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
};
