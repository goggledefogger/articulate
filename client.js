// shims
require('document-register-element')
require('fastclick')(document.body)

// custom elements
var Choice = require('./src/choice')
var firstChoice = new Choice()
document.querySelector('#page-outlet').appendChild(firstChoice)

var router = require('uri-router')

// page router on pathname
router({
  watch: 'pathname',
  outlet: '#page-outlet',
  routes: {
    '/': firstChoice.show()
  }
})
