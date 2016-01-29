var CSSBuilder = require('build-css')
var JSBuilder = require('build-js')
var Server = require('app-server')
var chalk = require('chalk')

var css = new CSSBuilder()
css.watch(function (err) {
  if (err) onerror(err)
  else onlog('css rebuilt')
})

var js = new JSBuilder({
  src: 'client.js',
  dest: 'public/build.js'
})
js.watch(function (err) {
  if (err) onerror(err)
  else onlog('js rebuilt')
})

var server = Server({
    port: '8080',
    root: 'public'
  }, function (err) {
  if (err) throw err
  onlog('app server listening on ' + server.port)
})
server.middleware = function (req, res, next) {
  onlog('app server got request: ' + req.method + ' ' + req.url)
  next()
}

function onlog (msg) {
  console.log(chalk.cyan(stamptime()), msg)
}

function onerror (err) {
  console.error(chalk.cyan(stamptime()), chalk.red(err.message))
}

function stamptime () {
  var d = new Date()
  return '[ ' + d.toDateString() + ' ' + d.toLocaleTimeString() + ' ]'
}
