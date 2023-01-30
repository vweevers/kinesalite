var once = require('once'),
    { KeyStream } = require('level-read-stream'),
    db = require('../db')

module.exports = function listStreams(store, data, cb) {
  cb = once(cb)
  var opts, keys, limit = data.Limit || 10

  if (data.ExclusiveStartStreamName)
    opts = {start: data.ExclusiveStartStreamName + '\x00'}

  keys = db.lazy(new KeyStream(store.metaDb, opts), cb)
    .take(limit + 1)

  keys.join(function(names) {
    cb(null, {StreamNames: names.slice(0, limit), HasMoreStreams: names.length > limit})
  })
}


