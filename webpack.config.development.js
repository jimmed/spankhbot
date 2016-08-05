var webpack = require('webpack')
var webpackTargetElectronRenderer = require('webpack-target-electron-renderer')
var path = require('path')

var config = {
  devtool: 'sourcemap',
  entry: [
    'webpack-hot-middleware/client?reload=true&path=http://localhost:8080/__webpack_hmr',
    './src/app/entry'
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.(png|svg)$/,
        loader: 'file'
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: 'http://localhost:8080/',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.scss'],
    alias: {
      foundation: path.join(__dirname, 'node_modules/foundation-sites')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}

config.target = webpackTargetElectronRenderer(config)

module.exports = config
