var sfHome = require('./home/')
var sfGame = require('./game/')
var sfForm = require('./form/')
var sfLobby = require('./lobby/');
var sfCommon = require('./../common/');
var sfConstants = require('./../common/constants');

angular.module('stories-with-friends', [

    // features
    sfHome,
    sfGame,
    sfLobby,

    // admin features
    sfForm,

    // common, including components and services
    sfCommon,
    sfConstants,

    // template modules
    // templates-app
    // templates-common

    // angular modules
    // ngResource // if desired

    // third party modules
    // These will not be browserified
    'firebase',
    //'ui.bootstrap',
    'ui.router',
    'mgcrea.ngStrap',
    'underscore',
    'LocalStorageModule',
    'angulartics',
    'angulartics.mixpanel',
    'uuid4',
    'ngDialog',
    'naif.base64',
    'angular-md5',
    'ngClipboard',
  ])

  .config(function($stateProvider, $urlRouterProvider, ngClipProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('sf', {
        abstract: true,
        views: {
          'header': {
            template: '<sf-header></sf-header>'
          },
          'content': {
            template: '<div>Main Content</div>'
          },
          'footer': {
            template: '<sf-footer></sf-footer>'
          }
        }
      });

    ngClipProvider.setPath('//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.6/ZeroClipboard.swf');

  })

;
