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
      })
      .state('sf.form.link', {
        url: '/link',
        views: {
          'content@': {
            template: fs.readFileSync(__dirname + '/link.tpl.html'),
            controller: 'FormCtrl as form'
          }
        }
      });
  })

  .controller('FormCtrl', function($state, Form, md5, _, uuid4) {
    var form = this;

    form.currentForm = {};

    form.currentForm.images = [{}];

    form.submitForm = function(f) {
      var images = f.images;
      var imagebytes = {};
      _.each(images, function(image) {
        if (image.base64model) {
          image.md5sum = md5.createHash(image.base64model.base64);
          imagebytes[image.md5sum] = image.base64model;
          delete image.base64model;
        }
      });
      var id = uuid4.generate();
      Form.createNewStory({
        name: f.name,
        prompt: f.prompt,
        id: id,
        images: images
      }, imagebytes, function(err){
        if (err) {
          alert(err);
        } else {
          form.currentForm.link = "https://storybook.firebaseapp.com/#/?activityPrompt=" + id;
          $state.data = {};
          $state.data.link = form.currentForm.link;
          $state.transitionTo('sf.form.link');
        }
      });
    }

    form.addNewImage = function() {
      form.currentForm.images.push({});
    };

    form.getLink = function() {
      if ($state.data && $state.data.link) {
        return $state.data.link;
      }
    };

    form.fallback = function(copy) {
      window.prompt('Press cmd+c(Mac) or ctrl-c(Windows) to copy the text below.', copy);
    }
  })

;

module.exports = 'sf.form';
