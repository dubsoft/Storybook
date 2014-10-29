var profanityFilter = require('./../../common/services/profanity-filter/');
var punctuation = require('./../../common/services/punctuation/');
var game = require('./../../common/services/game/');

var fs = require('fs');

angular.module('sf.game', [
    'ui.router',
    profanityFilter,
    punctuation,
    'ngSanitize'
  ])

  .config(function($stateProvider) {
    $stateProvider
      .state('sf.game', {
        url: '/games?uid&sid&activityPrompt',
        views: {
          'content@': {
            template: fs.readFileSync(__dirname + "/game.tpl.html"),
            controller: 'GameCtrl as game'
          }
        }
      });
  })
  .controller('GameCtrl', function($scope, $state, Game, User, ProfanityFilter, Punctuation) {
    var game = this;

    var currentUser = User.currentUser;
    if (!currentUser) {
      currentUser = User.getUserFromLocalStorage();
      if (currentUser) {
        User.setCurrentUser(currentUser);
      } else {
        console.log("There is no current user. Redirecting to sf.home");
        $state.go('sf.home');
        return;
      }
    }


    game.currentGame = Game.getGameByUser(User, $scope);
    game.currentGame.images = [];
    game.currentGame.imageCounter = 0;
    game.currentGame.newSentence = "";

    var gameId = User.currentUser.sid;

    game.currentGame.newSentence = "";
    game.currentGame.finishMessageToShow = "";

    game.closeGame = function() {
      var gameId = game.currentGame.$id;
      Game.closeGame(gameId);
    };

    game.getCurrentSentence = function() {
      return game.currentGame.newSentence;
    }

    game.loadImages = function() {
      var imageSet = Game.getImageSet($state.params.activityPrompt);
      game.currentGame.setName = imageSet.name;
      game.currentGame.images = imageSet.images;
      game.currentGame.image = imageSet.images[0];
    }

    game.submitEntry = function() {
      //do some validation here
      var sentence = game.getCurrentSentence();
      if (sentence === "") {
        return;
      }
      var errors = game.validateSentence(sentence);
      if (errors.length === 0) {
        Game.sendSentence(gameId, game.currentGame, sentence, User.currentUser);
        game.advanceImage();
      } else {
        game.showErrors(errors);
      }

    }

    game.advanceImage = function() {
      var i = game.currentGame.images;
      game.currentGame.imageCounter++;
      if (i[game.currentGame.imageCounter]) {
        game.currentGame.image = i[game.currentGame.imageCounter];
      } else {
        game.endOfStory();
      }
    };

    game.endOfStory = function() {
      alert("Thanks for playing!");
    };

    game.validateSentence = function(sentence) {
      var errors = [];
      var profane = ProfanityFilter.checkSentence(sentence);
      if (profane) {
        errors.push(profane);
      }
      var incorrectPunctuation = Punctuation.checkEndingPunctuation(sentence);
      if (incorrectPunctuation) {
        errors.push(incorrectPunctuation);
      }
      return errors;
    };

    game.showErrors = function(errors) {
      var eString = [];
      errors.forEach(function(err) {
        err.forEach(function(errString) {
          eString.push(errString);
        });
      });

      alert(eString.join("\n"))
    };

    game.finish = function() {
      Game.imDone(gameId, game.currentGame, User.currentUser);
    }

    game.isReadyToSubmit = function() {
      if (game.currentGame.requirements) {
        return game.currentGame.wordsUsed.length >= game.currentGame.requirements.needed;
      } else {
        return false;
      }
    };

    game.hasFinishMessageToShow = function() {
      return game.currentGame.finishMessageToShow !== "";
    }

    //Setup Game
    game.loadImages();

  })

;

module.exports = 'sf.game';
