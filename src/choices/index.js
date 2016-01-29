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

ChoicesView.prototype.show = function () {
  this.model = new ChoicesModel()
  this.model.on('update', this.render)
  this.model.watch()
}

ChoicesView.prototype.render = function () {
  if (!this.model) {
    return
  }

  hg(this, {
    '#choice-1 .choice-text': {_text: this.model.data['1'].text},
    '#choice-2 .choice-text': {_text: this.model.data['2'].text},
    '#choice-3 .choice-text': {_text: this.model.data['3'].text},
    '#choice-4 .choice-text': {_text: this.model.data['4'].text},
  })
}

ChoicesView.prototype._onclick = function (evt) {
  switch (evt.target.id) {
    case 'choice-1':
      break
    case 'choice-2':
      break
    case 'choice-3':
      break
    case 'choice-4':
      break
  }
}

ChoicesView.prototype.hide = function () {

}

module.exports = document.registerElement('x-choice', ChoicesView)
