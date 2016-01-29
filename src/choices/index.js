var ChoicesView = {
  prototype: Object.create(HTMLElement.prototype)
}

var hg = require('hyperglue2')
var ChoicesModel = require('./model')

var TIME_TO_TRANSITION = 2000

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
    '#choice-1': {
      _class: {
        button: !this.model.data['1'].blank,
        'no-more-choices': !this.model.data['1'].next_choices
      }
    },
    '#choice-1 .choice-text': {_text: this.model.data['1'].text},
    '#choice-2': {
      _class: {
        button: !this.model.data['2'].blank,
        'no-more-choices': !this.model.data['2'].next_choices
      }
    },
    '#choice-2 .choice-text': {_text: this.model.data['2'].text},
    '#choice-3': {
      _class: {
        button: !this.model.data['3'].blank,
        'no-more-choices': !this.model.data['3'].next_choices
      }
    },
    '#choice-3 .choice-text': {_text: this.model.data['3'].text},
    '#choice-4': {
      _class: {
        button: !this.model.data['4'].blank,
        'no-more-choices': !this.model.data['4'].next_choices
      }
    },
    '#choice-4 .choice-text': {_text: this.model.data['4'].text},
    '#back': {_class: {disabled: this.model.id === '1' || this._editing}},
    '#edit': {_text: this._editing ? 'DONE' : 'EDIT'},
    '.choice': {
      _class: {
        disabled: this._editing,
        editing: this._editing
      }
    }
  })
}

ChoicesView.prototype._toggleEditMode = function () {
  this._editing = !this._editing
  this.render()
}

ChoicesView.prototype._onclick = function (evt) {
  var self = this
  var choiceId = null
  var nextChoicesId = null

  if (evt.target.classList.contains('choice-1')) {
    choiceId = '1'
  } else if (evt.target.classList.contains('choice-2')) {
    choiceId = '2'
  } else if (evt.target.classList.contains('choice-3')) {
    choiceId = '3'
  } else if (evt.target.classList.contains('choice-4')) {
    choiceId = '4'
  } else if (evt.target.classList.contains('back')) {
    if (!this._editing) {
      nextChoicesId = this._previousChoice
    }
  } else if (evt.target.classList.contains('edit')) {
    this._toggleEditMode()
  }

  if (choiceId) {
    if (this.model.data[choiceId].blank && !this._editing) {
      return
    }
    if (this._editing) {
      this._editChoice(choiceId)
    } else {
      nextChoicesId = this.model.data[choiceId].next_choices
      this._previousChoice = this.model.id
      if (nextChoicesId) {
      } else {
        var newChoices = new ChoicesModel()
        newChoices.data['1'] = {
          text: '______',
          blank: true
        }
        newChoices.data['2'] = {
          text: '______',
          blank: true
        }
        newChoices.data['3'] = {
          text: '______',
          blank: true
        }
        newChoices.data['4'] = {
          text: '______',
          blank: true
        }
        newChoices.update(function () {
          self.model.data[choiceId].next_choices = newChoices.id
          self.model.update(function () {
            self._transitionToNextChoices(newChoices.id).call(self)
          })
        })
      }
    }
  }

  if (nextChoicesId) {
    this._transitionToNextChoices(nextChoicesId)
  }
}

ChoicesView.prototype._transitionToNextChoices = function (choicesId) {
  var self = this

  hg(this, {
    '#choices-container': {_class: {transitioning: true}},
    '.choice-text': {_class: {hidden: true}}
  })
  setTimeout(function () {
    hg(self, {
      '#choices-container': {_class: {transitioning: false}},
      '.choice-text': {_class: {hidden: false}}
    })
  }, TIME_TO_TRANSITION)
  this.show(choicesId)
}

ChoicesView.prototype._editChoice = function (choiceId) {
  var newChoice = window.prompt('What should it be?')
  if (newChoice) {
    this.model.data[choiceId].text = newChoice
    this.model.data[choiceId].blank = null
    this.model.update(this.render)
  }
}

module.exports = document.registerElement('x-choice', ChoicesView)
