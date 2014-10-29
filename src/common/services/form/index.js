var sfConstants = require('./../../constants');
var empirical = require('./../empirical/');
angular.module('sf.services.form', [
  sfConstants,
  empirical
])

.service("Form", function($firebase, baseFbUrl) {
  var form = this;

  var storiesRef = new Firebase(baseFbUrl + "/stories");

  form.createNewStory = function(story, cb) {
    var stories = $firebase(storiesRef).$asArray();
    stories.$add(story).then(cb);
  }
})

module.exports = 'sf.services.form';
