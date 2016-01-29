var ChoicesView = {
  prototype: Object.create(HTMLElement.prototype)
}

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
