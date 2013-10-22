'use strict';

angular.module('easyForms').
  directive('efForm', ['$parse', 'Restangular', 'efUtils', function($parse, Restangular, efUtils) {
    return {
      scope: {
        efResource: '@'
      },
      require: '^form',
      link: function(scope, elem, attrs, controller) {
        // Try to get property listed in efResource
        var parseResourceFromParent = function(res) {
          var parser = $parse(res);
          return parser(scope.$parent);
        };
        var parentResource = parseResourceFromParent(attrs.efResource);

        if (parentResource == undefined || !efUtils.isRestangularResource(parentResource)) {
          scope.efResource = Restangular.all(scope.efResource);
        } else {
          // TODO: Should copy if the resource is not a collection
          scope.efResource = parentResource;
        }

        scope.form = scope[attrs['name']];
        scope.efModel = {};
      }
    };
  }]);
