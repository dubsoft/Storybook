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

  .controller('FormCtrl', function(Form, md5, _, uuid4) {
    var form = this;

    form.currentForm = {};

    form.currentForm.images = [{}];

    form.submitForm = function(f) {
      var images = f.images;
      _.each(images, function(image) {
        image.md5sum = md5.createHash(image.base64model.base64);
      });
      Form.createNewStory({
        name: f.name,
        id: uuid4.generate(),
        images: images
      }, function(err){
        if (err) {
          alert(err);
        }
      });
    }

    form.addNewImage = function() {
      form.currentForm.images.push({});
    };
  })

;

module.exports = 'sf.form';
