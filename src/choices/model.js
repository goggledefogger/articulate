module.exports = Choices

var inherits = require('inherits')
var RealtimeModel = require('realtime-model')
var Firebase = require('firebase')

var db = new Firebase('articulate-dev.firebaseio.com')

inherits(Choices, RealtimeModel)

function Choices (data) {
  var storage = null
  if (data && data.id) {
    storage = db.child('choices').child(data.id)
  } else {
    storage = db.child('choices').push()
  }

  RealtimeModel.call(this, storage, data)
}
