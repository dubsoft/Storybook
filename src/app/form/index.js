var fs = require('fs');

angular.module('sf.form', [
    'ui.router'
  ])

  .config(function($stateProvider) {
    $stateProvider
      .state('sf.form', {
        url: '/form?uid',
        views: {
          'content@': {
            template: fs.readFileSync(__dirname + '/form.tpl.html'),
            controller: 'FormCtrl as form'
          }
        }
      });
  })

  .controller('FormCtrl', function(Form) {
    var form = this;

    form.currentForm = {};

    form.currentForm.images = [{}];

    form.submitForm = function(f) {
      Form.submit(f, function(err) {
        //do something sending the quill.js close form event thing
      });
    }

    form.addNewImage = function() {
      form.currentForm.images.push({});
    };
  })

;

module.exports = 'sf.form';
