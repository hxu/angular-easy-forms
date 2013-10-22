'use strict';

angular.module('easyForms').
  directive('efForm', ['$parse', function($parse) {
    return {
      scope: {
        efResourceUrl: '@'
      },
      require: '^form',
      link: function(scope, elem, attrs, controller) {
        scope.form = scope[attrs['name']];
      }
    };
  }]);
