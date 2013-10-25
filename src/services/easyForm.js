'use strict';

/*
 * @ngdoc service
 * @description This service encapsulates all of the functions used by the easyForm directives.
 * These have been broken out into this service instead of being put into the directive directly so that users don't
 * have to use the directive in order to use some of the functions
 */

angular.module('easyForms').
  factory('easyForm', ['efUtils', 'Restangular', '$parse', function(efUtils, Restangular, $parse) {

    var svc = {

      $initialize: function(scope, resource) {
        if (resource == undefined || !efUtils.isRestangularResource(resource)) {
          scope.resourceObj = Restangular.all(attrs.efResource);
        } else {
          if (efUtils.isRestangularCollection(resource)) {
            scope.resourceObj = resource;
          } else {
            // Will a PUT be made on the efResource or the model object?
            scope.resourceObj = Restangular.copy(resource);
            scope.model = scope.resourceObj;
            scope.pristineModel = Restangular.copy(scope.resourceObj); // Need a separate copy to store pristine state
            scope.isCollection = false;
            scope.editMode = true;
          }
        }
        // Merging in the configuration options
        var parentConfig = $parse(attrs.efConfig)(scope.$parent);
        if (parentConfig != undefined && _.isObject(parentConfig)) {
          scope.efConfig = angular.extend(defaultConfig, parentConfig);
        } else {
          scope.efConfig = defaultConfig;
        }
      },

      $clearMessages: function(scope) {
        scope.messages.length = 0;
      },

      $clearErrors: function(scope) {
        scope.errors = {};
      },

      reset: function(scope) {
        if (efUtils.isRestangularResource(scope.model)) {
          scope.model = scope.resourceObj = Restangular.copy(scope.pristineModel);
        } else {
          scope.model = angular.copy(scope.pristineModel);
        }
        scope.$clearMessages();
        scope.$clearErrors();
        scope.form.$setPristine();
        scope.$emit(scope.efConfig.resetSignal);
      },

      submit: function(scope) {
        var promise;

        scope.$clearErrors();

        if (scope.editMode) {
          promise = scope.resourceObj.put();
        } else {
          promise = scope.resourceObj.post(scope.model);
        }
        scope.$emit(scope.efConfig.submitSignal);
        scope.responseHandler(promise);
      },

      successHandler: function(scope) {
        scope.messages.push(scope.efConfig.successMessage);
        scope.$emit(scope.efConfig.successSignal);
      },

      errorHandler: function(scope, resp) {
        scope.messages.push(scope.efConfig.errorMessage);
        angular.forEach(resp.data, function(errormsg, field) {
          if (angular.isArray(errormsg)) {
            scope.errors[field] = errormsg;
          } else {
            scope.errors[field] = [errormsg];
          }
        });
        scope.$emit(scope.efConfig.errorSignal);
      },

      responseHandler: function(scope, promise) {
        promise.then(scope.successHandler, scope.errorHandler);
      }

    };

    svc.extendScope = function(scope) {
      angular.forEach(svc, function(func, name) {
        if (name == 'extendScope') {
          return;
        }
        scope[name] = _.bind(func, scope, scope);
      });
    };

  }]);