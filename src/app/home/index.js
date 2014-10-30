var User = require('./../../common/services/user/');
var fs = require('fs');

angular.module('sf.home', [
    'ui.router'
  ])

  .config(function($stateProvider) {
    $stateProvider
      .state('sf.home', {
        url: '/?uid&sid&activityPrompt',
        views: {
          'content@': {
            template: fs.readFileSync(__dirname + '/home.tpl.html'),
            controller: 'HomeCtrl as home'
          }
        }
      });
  })

  .controller('HomeCtrl', function($state, User, Game, Form, uuid4){
    var home = this;

    home.prompts = Game.getPrompts();
    home.fbPrompts = Form.getPrompts();

    home.createStory = function() {
      $state.go('sf.form');
    };


    home.setUser = function(user) {
      User.setCurrentUser(user);
      $state.go('sf.game');
    };

    function continueWithValidSession() {
      if ($state.params.uid && $state.params.sid && $state.params.activityPrompt) {
        home.setUser({
          uid: $state.params.uid,
          sid: $state.params.sid,
          activityPrompt: $state.params.activityPrompt
        });
      } else if ($state.params.activityPrompt){
        var p = $state.params.activityPrompt || 1;
        home.setUser({
          uid: uuid4.generate(),
          sid: uuid4.generate(),
          activityPrompt: p
        });
      } else {
        var user = User.getUserFromLocalStorage();
        if (user) {
          //home.setUser(user);
        } else {
          console.log("showing activity list instead");
        }
      }
    }

    continueWithValidSession();

    home.usePrompt = function(prompt) {
      home.setUser({
        uid: uuid4.generate(),
        sid: uuid4.generate(),
        activityPrompt: prompt.id
      });
    }
  })

;

module.exports = 'sf.home';
