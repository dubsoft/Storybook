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
      var imagebytes = {};
      _.each(images, function(image) {
        image.md5sum = md5.createHash(image.base64model.base64);
        imagebytes[image.md5sum] = image.base64model;
        delete image.base64model;
      });
      Form.createNewStory({
        name: f.name,
        id: uuid4.generate(),
        images: images
      }, imagebytes, function(err){
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
