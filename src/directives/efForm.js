'use strict';

angular.module('easyForms').
  directive('efForm', ['$parse', '$resource', 'efUtils', function($parse, $resource, efUtils) {
    return {
      scope: {
        efResource: '@'
      },
      require: '^form',
      link: function(scope, elem, attrs, controller) {
        if (!efUtils.isResource(scope.efResource)) {
          scope.efResource = $resource(scope.efResource);
        }

        scope.form = scope[attrs['name']];
        scope.efModel = {};
      }
    };
  }]);
