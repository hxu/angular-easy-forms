'use strict';

angular.module('easyForms').
  directive('efMessages', function() {
    return {
      replace: true,
      template: '<div class="alert alert-{{ m.class }}" ng-show="hasMessages()">' +
        '<div ng-repeat="m in messages">{{ m.text }}</div>' +
        '</div>'
    };
  });