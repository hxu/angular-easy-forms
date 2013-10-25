'use strict';

angular.module('easyForms').

  /*
   * @ngdoc directive
   * @name easyForms.efInput
   *
   * @description use as an attribute on an input tag.
   */
  directive('efInput', function() {
    return {
      replace: true,
      template: function(elem, attrs) {
        var newElem =
          '<div class="form-group">' +
            '<label for="' + attrs.id + '">' + attrs.efLabel + '</label>' +
            '<input ng-model="model.' + attrs.name + '" class="form-control">' +
          '</div>';
        return newElem;
      },
      compile: function(elem, attrs) {
        var inputElem = elem.find('input');
        // Can use this to copy over classes
      }
    };
  });