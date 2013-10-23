'use strict';

angular.module('easyForms').
  directive('efForm', ['$parse', 'Restangular', 'efUtils', function($parse, Restangular, efUtils) {
    return {
      scope: {
        efResource: '@'
      },
      require: '^form',
      link: function(scope, elem, attrs, controller) {
        // Variables holding the state of the form
        scope.editMode = false;
        scope.isCollection = true;

        // Resolve the resource attribute
        // 1) If it can't be found on the parent resource, create a new Restangular Collection object
        // 2) If it can be found, but is not a Restangular object, create a new Restangular Collection object
        // 3) If it can be found and is a Restangular object, and:
        //    a) it is a Collection -> use POST
        //    b) it is an Element -> use PUT

        var parseResourceFromParent = function(res) {
          var parser = $parse(res);
          return parser(scope.$parent);
        };
        var parentResource = parseResourceFromParent(attrs.efResource);

        if (parentResource == undefined || !efUtils.isRestangularResource(parentResource)) {
          scope.efResource = Restangular.all(scope.efResource);
          scope.efModel = {};
        } else {
          if (efUtils.isRestangularCollection(parentResource)) {
            scope.efResource = parentResource;
            scope.efModel = {};
          } else {
            scope.efResource = Restangular.copy(parentResource);
            scope.efModel = scope.efResource;
            scope.isCollection = false;
            scope.editMode = true;
          }
        }

        scope.form = scope[attrs['name']];
      }
    };
  }]);
