var ChoicesView = {
  prototype: Object.create(HTMLElement.prototype)
}

var hg = require('hyperglue2')
var ChoicesModel = require('./model')

ChoicesView.prototype.createdCallback = function () {
  this.innerHTML = require('./index.html')

  this.render = this.render.bind(this)
  this._onclick = this._onclick.bind(this)

  this.addEventListener('click', this._onclick)
}

ChoicesView.prototype.show = function (id) {
  if (this.model && this.model.loaded && this.model.data.id !== id) {
    this.model.unwatch()
    this.model.removeListener('update', this.render)
    delete this.model
  }

  if (!id) {
    id = 1
  }

  if (!this.model) {
    this.model = new ChoicesModel({id: id})
    this.model.on('update', this.render)
    this.model.watch()
  }
}

ChoicesView.prototype.render = function () {
  if (!this.model) {
    return
  }

  hg(this, {
    '#choice-1 .choice-text': {_text: this.model.data['1'].text},
    '#choice-2 .choice-text': {_text: this.model.data['2'].text},
    '#choice-3 .choice-text': {_text: this.model.data['3'].text},
    '#choice-4 .choice-text': {_text: this.model.data['4'].text}
  })
}

ChoicesView.prototype._onclick = function (evt) {
  var choiceId = null
  switch (evt.target.id) {
    case 'choice-1':
      choiceId = '1'
      break
    case 'choice-2':
      choiceId = '2'
      break
    case 'choice-3':
      choiceId = '3'
      break
    case 'choice-4':
      choiceId = '4'
      break
  }

  if (choiceId) {
    var nextChoicesId = this.model.data[choiceId].next_choices
    this.show(nextChoicesId)
  }
}

module.exports = document.registerElement('x-choice', ChoicesView)
