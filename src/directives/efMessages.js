'use strict';

angular.module('easyForms').
  directive('efMessages', function() {
    return {
      replace: true,
      template: '<div class="alert alert-info" ng-show="hasMessages()">' +
        '<div ng-repeat="m in messages">{{ m }}</div>' +
        '</div>'
    };
  });