module.exports = Speaker

var DEFAULT_VOICE_NAME = 'Google UK English Female'

function Speaker (opts) {
  opts = opts || {}
  if ('speechSynthesis' in window) {
    this._supported = true
  }
  if (this._supported) {
    this._setVoice(opts.voiceName)
  }
}

Speaker.prototype._setVoice = function (voiceName) {
  var self = this
  if (!voiceName) {
    voiceName = DEFAULT_VOICE_NAME
  }

  window.speechSynthesis.onvoiceschanged = function () {
    var voices = window.speechSynthesis.getVoices()
    for (var i = 0; i < voices.length; i++) {
      if (voices[i].name === voiceName) {
        self._voice = voices[i]
        break
      }
    }
  }
}

Speaker.prototype.speak = function (text) {
  if (!this._supported) return

  var utterance = new SpeechSynthesisUtterance(text)
  if (this._voice) {
    utterance.voice = this._voice
  }
  window.speechSynthesis.speak(utterance)
}
