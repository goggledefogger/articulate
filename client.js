// shims
require('document-register-element')
require('fastclick')(document.body)

// custom elements
var ChoicesView = require('./src/choices')
var firstChoices = new ChoicesView()
document.querySelector('#page-outlet').appendChild(firstChoices)

var router = require('uri-router')

// page router on pathname
router({
  watch: 'pathname',
  outlet: '#page-outlet',
  routes: {
    '/': firstChoices.show()
  }
})
