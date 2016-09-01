var express = require('express')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var spawn = require('child_process').spawn

var config = require('./webpack.config.development')

var compiler = webpack(config)
var server = express()

server.use(express.static('public'))
server.use(express.static('assets'))

server.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}))

server.use(webpackHotMiddleware(compiler))

server.listen(8080, function () {
  var app = spawn('./node_modules/.bin/electron', ['.'])
  app.stdout.pipe(process.stdout)
  app.stderr.pipe(process.stderr)
})
