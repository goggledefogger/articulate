module.exports = Choices

var inherits = require('inherits')
var RealtimeModel = require('realtime-model')
var Firebase = require('firebase')

var db = new Firebase('articulate-dev.firebaseio.com')

inherits(Choices, RealtimeModel)

function Choices (data) {
  var storage = db.child('choices/1')
  RealtimeModel.call(this, storage, data)
}
