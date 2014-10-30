var sfConstants = require('./../../constants');
var empirical = require('./../empirical/');
angular.module('sf.services.form', [
  sfConstants,
  empirical
])

.service("Form", function($firebase, baseFbUrl, _) {
  var form = this;

  var storiesRef = new Firebase(baseFbUrl + "/stories");
  var storiesBytesRef = new Firebase(baseFbUrl + "/stories_image_bytes");

  form.createNewStory = function(story, imagebytes, cb) {
    var stories = $firebase(storiesRef).$asArray();
    stories.$add(story).then(function() {
      _.each(imagebytes, function(ib, key) {
        storiesBytesRef.child(key).set(ib);
      });
      cb();
    });
  }

  form.getPrompts = function() {
    return $firebase(storiesRef).$asArray();
  }

  form.getStory = function(activityId, cb) {
    var stories = $firebase(storiesRef).$asArray();
    stories.$loaded().then(function(stories) {
      var storyToReturn = null;
      _.each(stories, function(story) {
        if (story.id === activityId) {
          storyToReturn = story;
        }
      });
      if (storyToReturn) {
        cb(null, storyToReturn, true);
      } else {
        cb(new Error("Couldn't find story with id " + activityId));
      }
    });
  }
})

module.exports = 'sf.services.form';
