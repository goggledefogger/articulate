module.exports = Choices

var inherits = require('inherits')
var RealtimeModel = require('realtime-model')
var Firebase = require('firebase')

var db = new Firebase('articulate-dev.firebaseio.com')

inherits(Choices, RealtimeModel)

function Choices (data) {
  var choiceId = 1
  if (data && data.id) {
    choiceId = data.id
  }
  var storage = db.child('choices').child(choiceId)
  RealtimeModel.call(this, storage, data)
}
