var chokidar = require('chokidar')
var sass = require('node-sass')

var cache
var nodeEnv = process.env.NODE_ENV || 'development'

module.exports = function (config) {
  var watcher
  config.file = config.file || '.'

  var refreshCache = function refreshCache (cb) {
    sass.render(config, (err, result) => {
      if (err) {
          // hand off error handling to callback
        if (cb) {
          return cb(err)
        }
        throw (err)
      }

      // update our cache with the newly compiled css
      cache = result.css

      // watch files included in the sass
      if (watcher && result.stats && result.stats.includedFiles) {
        watcher.add(result.stats.includedFiles)
      }

      if (cb) {
        cb(null, cache)
      }
    })
  }

  if (config.watch && nodeEnv === 'development') {
    var asyncRefresh = function () {
      refreshCache()
    }
    watcher = chokidar.watch(config.file, { ignored: /[/\\]\./ })
    watcher.on('change', asyncRefresh).on('unlink', asyncRefresh)
  }

  if (config.precompile) {
    refreshCache()
  }

  return function (req, res, next) {
    if (cache) {
      return res.set('content-type', 'text/css').send(cache)
    }
    refreshCache(function (err, newCache) {
      if (err) {
        next(err)
      }
      res.set('Content-Type', 'text/css').send(newCache)
    })
  }
}
