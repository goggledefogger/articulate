var Choice = {
  prototype: Object.create(HTMLElement.prototype)
}

Choice.prototype.createdCallback = function () {
  this.innerHTML = require('./index.html')
}

Choice.prototype.show = function () {

}

Choice.prototype.hide = function () {

}

module.exports = document.registerElement('x-choice', Choice)
