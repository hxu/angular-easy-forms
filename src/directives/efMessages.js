'use strict';

angular.module('easyForms').
  directive('efMessages', function() {
    return {
      replace: true,
      template: '<div ng-show="hasMessages()">' +
        '<div ng-repeat="m in messages" class="alert alert-{{ m.class }}">' +
        '{{ m.text }}' +
        '</div>' +
        '</div>'
    };
  });