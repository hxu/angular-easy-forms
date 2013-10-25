'use strict';

angular.module('easyForms').
  directive('efSubmit', function() {
    return {
      template: '<button type="submit" class="btn btn-default" ng-click="submit()">Submit</button>',
      replace: true,
    };
  }).
  directive('efReset', function() {
    return {
      replace: true,
      template: '<button class="btn" ng-click="reset()">Reset</button>'
    }
  });