'use strict';

angular.module('easyForms').

  /*
   * @ngdoc directive
   * @name easyForms.efInput
   *
   * @description use as an attribute on an input tag.
   */
  directive('efInputText', function() {
    return {
      restrict: 'A',
      priority: 100,
      link: function(scope, elem, attrs) {
        // Change the ngModel attribute to be model.{name}
        console.log(attrs);
        console.log(attrs);
      }
    };
  });