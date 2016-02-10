var ChoicesView = {
  prototype: Object.create(HTMLElement.prototype)
}

var hg = require('hyperglue2')
var ChoicesModel = require('./model')
var merge = require('merge')
var Speaker = require('../speak')

var TIME_TO_TRANSITION = 2000
var INITIAL_CHOICE_ID = 1

var DEFAULT_CHOICE_DATA = {
  blank: true,
  text: '______'
}
var CHOICE_IDS = ['1', '2', '3', '4', '5']

ChoicesView.prototype.createdCallback = function () {
  this.innerHTML = require('./index.html')

  this.render = this.render.bind(this)
  this._onclick = this._onclick.bind(this)
  this._transitionToNextChoices = this._transitionToNextChoices.bind(this)

  this.addEventListener('click', this._onclick)

  this._history = []
  this._speaker = new Speaker()
}

ChoicesView.prototype.show = function (id) {
  if (this.model && this.model.loaded && this.model.data.id !== id) {
    this.model.unwatch()
    this.model.removeListener('update', this.render)
    delete this.model
  }

  if (!id) {
    id = INITIAL_CHOICE_ID
  }

  this._history.push({id: id})

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

  var previousChoice = this._history.length > 1 ? this._history[this._history.length - 2].text : null

  for (var i = 0; i < CHOICE_IDS.length; i++) {
    if (!this.model.data[CHOICE_IDS[i]]) {
      this.model.data[CHOICE_IDS[i]] = merge({}, DEFAULT_CHOICE_DATA)
    }
  }

  hg(this, {
    '#choice-1': {
      _class: {
        button: !this.model.data['1'].blank,
        'no-more-choices': !this.model.data['1'].next_choices
      }
    },
    '#choice-1 .choice-text': {_text: this.model.data['1'].text},
    '#choice-1 .choice-audio': {_class: {hidden: !this._editing && this.model.data['1'].mute}},
    '#choice-1 .choice-audio > i': {_class: {
      'fa-volume-up': !this.model.data['1'].mute,
      'fa-volume-off': this.model.data['1'].mute
    }},
    '#choice-2': {
      _class: {
        button: !this.model.data['2'].blank,
        'no-more-choices': !this.model.data['2'].next_choices
      }
    },
    '#choice-2 .choice-text': {_text: this.model.data['2'].text},
    '#choice-2 .choice-audio': {_class: {hidden: !this._editing && this.model.data['2'].mute}},
    '#choice-2 .choice-audio > i': {_class: {
      'fa-volume-up': !this.model.data['2'].mute,
      'fa-volume-off': this.model.data['2'].mute
    }},
    '#choice-3': {
      _class: {
        button: !this.model.data['3'].blank,
        'no-more-choices': !this.model.data['3'].next_choices
      }
    },
    '#choice-3 .choice-text': {_text: this.model.data['3'].text},
    '#choice-3 .choice-audio': {_class: {hidden: !this._editing && this.model.data['3'].mute}},
    '#choice-3 .choice-audio > i': {_class: {
      'fa-volume-up': !this.model.data['3'].mute,
      'fa-volume-off': this.model.data['3'].mute
    }},
    '#choice-4': {
      _class: {
        button: !this.model.data['4'].blank,
        'no-more-choices': !this.model.data['4'].next_choices
      }
    },
    '#choice-4 .choice-text': {_text: this.model.data['4'].text},
    '#choice-4 .choice-audio': {_class: {hidden: !this._editing && this.model.data['4'].mute}},
    '#choice-4 .choice-audio > i': {_class: {
      'fa-volume-up': !this.model.data['4'].mute,
      'fa-volume-off': this.model.data['4'].mute
    }},
    '#choice-5': {
      _class: {
        button: !this.model.data['5'].blank,
        'no-more-choices': !this.model.data['5'].next_choices
      }
    },
    '#choice-5 .choice-text': {_text: this.model.data['5'].text},
    '#choice-5 .choice-audio': {_class: {hidden: !this._editing && this.model.data['5'].mute}},
    '#choice-5 .choice-audio > i': {_class: {
      'fa-volume-up': !this.model.data['5'].mute,
      'fa-volume-off': this.model.data['5'].mute
    }},
    '.choice-audio': {_class: {editing: this._editing}},
    '#home': {_class: {disabled: this.model.id === '1' || this._editing}},
    '#back': {_class: {disabled: this.model.id === '1' || this._editing}},
    '#previous-choice': {_text: previousChoice},
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
  if (!this._editing) {
    var code = window.prompt('Secret Code:')
    if (code !== 'peace576') {
      window.alert('Incorrect Code')
      return
    }
  }

  this._editing = !this._editing
  this.render()
}

ChoicesView.prototype._onclick = function (evt) {
  if (!this.model || !this.model.loaded) return

  var self = this
  var choiceId = null
  var nextChoicesId = null
  var goingBack = false

  if (this._transitioning) {
    return
  }

  var toggleAudio = evt.target.classList.contains('choice-audio')
  if (evt.target.classList.contains('choice-1')) {
    choiceId = '1'
  } else if (evt.target.classList.contains('choice-2')) {
    choiceId = '2'
  } else if (evt.target.classList.contains('choice-3')) {
    choiceId = '3'
  } else if (evt.target.classList.contains('choice-4')) {
    choiceId = '4'
  } else if (evt.target.classList.contains('choice-5')) {
    choiceId = '5'
  } else if (evt.target.classList.contains('home')) {
    if (this._history.length <= 1) return

    if (!this._editing) {
      goingBack = true
      this._history = []
      nextChoicesId = INITIAL_CHOICE_ID
    }
  } else if (evt.target.classList.contains('back')) {
    if (this._history.length <= 1) return

    if (!this._editing) {
      goingBack = true
      this._history.pop()
      nextChoicesId = this._history[this._history.length - 1].id
      this._history.pop()
    }
  } else if (evt.target.classList.contains('edit')) {
    this._toggleEditMode()
  }

  if (choiceId) {
    if (this.model.data[choiceId] && this.model.data[choiceId].blank && !this._editing) {
      return
    }
    if (this._editing) {
      if (toggleAudio) {
        this._toggleAudio(choiceId)
      } else {
        this._editChoice(choiceId)
      }
    } else {
      if (!this.model.data[choiceId].mute) {
        this._speakChoice(this.model.data[choiceId].text)
      }

      nextChoicesId = this.model.data[choiceId].next_choices
      if (!nextChoicesId) {
        var newChoices = new ChoicesModel()
        for (var i = 0; i < CHOICE_IDS.length; i++) {
          newChoices.data[CHOICE_IDS[i]] = merge({}, DEFAULT_CHOICE_DATA)
        }
        newChoices.update(function () {
          self.model.data[choiceId].next_choices = newChoices.id
          self.model.update(function () {
            self._transitionToNextChoices(newChoices.id)
          })
        })
      }
    }
  }

  if (nextChoicesId) {
    if (!goingBack) {
      this._history[this._history.length - 1].text = this.model.data[choiceId].text
    }
    this._transitionToNextChoices(nextChoicesId)
  }
}

ChoicesView.prototype._toggleAudio = function (choiceId) {
  if (this.model.data[choiceId].mute) {
    this.model.data[choiceId].mute = null
  } else {
    this.model.data[choiceId].mute = true
  }
  this.model.update(this.render)
}

ChoicesView.prototype._speakChoice = function (text) {
  this._speaker.speak(text)
}

ChoicesView.prototype._transitionToNextChoices = function (choicesId) {
  var self = this

  this._transitioning = true
  hg(this, {
    '#choices-container': {_class: {transitioning: true}},
    '.choice-text': {_class: {hidden: true}},
    '#previous-choice': {_class: {hidden: true}}
  })
  setTimeout(function () {
    self._transitioning = false
    hg(self, {
      '#choices-container': {_class: {transitioning: false}},
      '.choice-text': {_class: {hidden: false}},
      '#previous-choice': {_class: {hidden: false}}
    })
  }, TIME_TO_TRANSITION)
  this.show(choicesId)
}

ChoicesView.prototype._editChoice = function (choiceId) {
  var newChoice = window.prompt('What should the new choice be?')
  if (newChoice) {
    this.model.data[choiceId] = this.model.data[choiceId] || {}
    this.model.data[choiceId].text = newChoice
    this.model.data[choiceId].blank = null
    this.model.update(this.render)
  }
}

module.exports = document.registerElement('x-choice', ChoicesView)
