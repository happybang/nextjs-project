// This file is used for when users run `require('inext-server')`
const Server = require('./dist/server/next-server').default
module.exports = function (options) {
  return new Server(options)
}
