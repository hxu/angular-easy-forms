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

        scope.hasErrors = function() {
          return !_.isEmpty(scope.errors);
        };

        scope.form = scope[attrs['name']];
        scope.errors = {};
        scope.messages = []; // Something like "Submission successful"
        scope.efModel = {}; // Data model for the form
        scope.pristineModel = {};
        scope.efResource = null; // Restangular resource

        // Config variables
        scope.efConfig = {
          triggerResetSignalName: 'efTriggerFormReset',
          resetSignalName: 'efFormReset',
          submitSignalName: 'efFormSubmit',
          successSignal: 'efFormSubmitSuccess',
          errorSignal: 'efFormSubmitError',
          successMessage: 'Form submission success',
          errorMessage: 'Form submission error',
        };

        /*
         * Form Initialization
         */

        var parseResourceFromParent = function(res) {
          var parser = $parse(res);
          return parser(scope.$parent);
        };
        var parentResource = parseResourceFromParent(attrs.efResource);

        if (parentResource == undefined || !efUtils.isRestangularResource(parentResource)) {
          scope.efResource = Restangular.all(attrs.efResource);
        } else {
          if (efUtils.isRestangularCollection(parentResource)) {
            scope.efResource = parentResource;
          } else {
            // Will a PUT be made on the efResource or the efModel object?
            scope.efResource = Restangular.copy(parentResource);
            scope.efModel = scope.efResource;
            scope.pristineModel = Restangular.copy(scope.efResource); // Need a separate copy to store pristine state
            scope.isCollection = false;
            scope.editMode = true;
          }
        }

        /*
         * Form state tidying
         */

        var clearMessages = function() {
          scope.messages.length = 0;
        };

        var clearErrors = function() {
        };

        /*
         * Form Actions
         */

        scope.reset = function() {
          if (efUtils.isRestangularResource(scope.efModel)) {
            scope.efModel = Restangular.copy(scope.pristineModel);
          } else {
            scope.efModel = angular.copy(scope.pristineModel);
          }
          scope.form.$setPristine();
          scope.$emit(scope.efConfig.resetSignalName);
        };
        scope.$on(scope.efConfig.triggerResetSignalName, function() {scope.reset()});

        scope.submit = function() {
          var promise;

          if (scope.editMode) {
            promise = scope.efResource.put();
          } else {
            promise = scope.efResource.post(scope.efModel);
          }
          scope.$emit(scope.efConfig.submitSignalName);
          scope.responseHandler(promise);
        };

        scope.successHandler = function() {
          scope.messages.push(scope.efConfig.successMessage);
          scope.$emit(scope.efConfig.successSignal);
        };

        scope.errorHandler = function(resp) {
          scope.messages.push(scope.efConfig.errorMessage);
          angular.extend(scope.errors, resp.data);
          scope.$emit(scope.efConfig.errorSignal);
        };

        scope.responseHandler = function(promise) {
          promise.then(scope.successHandler, scope.errorHandler);
        };
      }
    };
  }]);
