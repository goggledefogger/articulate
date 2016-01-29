var Choice = {
  prototype: Object.create(HTMLElement.prototype)
}

Choice.prototype.createdCallback = function () {
  this.innerHTML = require('./index.html')

  this._onclick = this._onclick.bind(this)
  this.addEventListener('click', this._onclick)
}

Choice.prototype.show = function () {

}

Choice.prototype._onclick = function (evt) {
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

Choice.prototype.hide = function () {

}

module.exports = document.registerElement('x-choice', Choice)
