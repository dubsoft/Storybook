var sfConstants = require('./../../constants');
var empirical = require('./../empirical/');
angular.module('sf.services.form', [
  sfConstants,
  empirical
])

.service("Form", function($firebase, baseFbUrl, _) {
  var form = this;

  var storiesRef = new Firebase(baseFbUrl + "/stories");

  form.createNewStory = function(story, cb) {
    var stories = $firebase(storiesRef).$asArray();
    stories.$add(story).then(function() {
      cb();
    });
  }

  form.getPrompts = function() {
    return $firebase(storiesRef).$asArray();
  }

  form.getStory = function(activityId, cb) {
    var stories = $firebase(storiesRef).$asArray();
    stories.$loaded().then(function(stories) {
      _.each(stories, function(story) {
        if (story.id === activityId) {
          cb(null, story);
        }
      });
      cb(new Error("Couldn't find story with id " + activityId));
    });
  }
})

module.exports = 'sf.services.form';
