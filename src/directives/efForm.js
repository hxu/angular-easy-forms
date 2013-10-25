'use strict';

angular.module('easyForms').
  directive('efForm', ['$parse', 'Restangular', 'efUtils', function($parse, Restangular, efUtils) {
    return {
      scope: {
        efResource: '='
      },
      require: '^form',
      link: function(scope, elem, attrs, controller) {
        // Variables holding the state of the form
        scope.editMode = false;
        scope.isCollection = true;

        scope.hasErrors = function() {
          return !_.isEmpty(scope.errors);
        };
        scope.hasMessages = function() {
          return scope.messages.length > 0;
        }

        scope.form = scope[attrs['name']];
        scope.errors = {};
        scope.messages = []; // Something like "Submission successful"
        scope.efModel = {}; // Data model for the form
        scope.pristineModel = {};

        // Config variables
        var defaultConfig = {
          triggerResetSignal: 'efTriggerFormReset',
          triggerReinitializeSignal: 'efReinitialize',
          resetSignal: 'efFormReset',
          submitSignal: 'efFormSubmit',
          successSignal: 'efFormSubmitSuccess',
          errorSignal: 'efFormSubmitError',
          successMessage: 'Form submission success',
          errorMessage: 'Form submission error',
        };

        /*
         * Form Initialization
         */

        // Setting up the resource and model

        /*
         * @doc function
         * @name easyForms.efForm:$initialize
         *
         * @description Initializes the form by:
         *  - resolving the resource attribute to a resource object
         *  - if a configuration object is provided, merging it into the form's configuration
         *
         * @param {Restangular resource} The resource to bind the form to.  If this is null, the form will create a new
         * Restangular object with the string value of the efResource attribute on the directive
         *
         */

        scope.$initialize = function(resource) {
          if (resource == undefined || !efUtils.isRestangularResource(resource)) {
            scope.resourceObj = Restangular.all(attrs.efResource);
          } else {
            if (efUtils.isRestangularCollection(resource)) {
              scope.resourceObj = resource;
            } else {
              // Will a PUT be made on the efResource or the efModel object?
              scope.resourceObj = Restangular.copy(resource);
              scope.efModel = scope.resourceObj;
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

        };

        scope.$initialize(scope.efResource);
        scope.$watch('efResource', function(newVal) {
          scope.$initialize(newVal);
        });

        /*
         * Form state tidying
         */

        scope.$clearMessages = function() {
          scope.messages.length = 0;
        };

        scope.$clearErrors = function() {
          scope.errors = {};
        };

        /*
         * Form Actions
         */

        scope.reset = function() {
          if (efUtils.isRestangularResource(scope.efModel)) {
            scope.efModel = scope.resourceObj = Restangular.copy(scope.pristineModel);
          } else {
            scope.efModel = angular.copy(scope.pristineModel);
          }
          scope.$clearMessages();
          scope.$clearErrors();
          scope.form.$setPristine();
          scope.$emit(scope.efConfig.resetSignal);
        };
        scope.$on(scope.efConfig.triggerResetSignal, function() {scope.reset()});

        scope.submit = function() {
          var promise;

          scope.$clearErrors();

          if (scope.editMode) {
            promise = scope.resourceObj.put();
          } else {
            promise = scope.resourceObj.post(scope.efModel);
          }
          scope.$emit(scope.efConfig.submitSignal);
          scope.responseHandler(promise);
        };

        scope.successHandler = function() {
          scope.messages.push(scope.efConfig.successMessage);
          scope.$emit(scope.efConfig.successSignal);
        };

        scope.errorHandler = function(resp) {
          scope.messages.push(scope.efConfig.errorMessage);
          angular.forEach(resp.data, function(errormsg, field) {
            if (angular.isArray(errormsg)) {
              scope.errors[field] = errormsg;
            } else {
              scope.errors[field] = [errormsg];
            }
          });
          scope.$emit(scope.efConfig.errorSignal);
        };

        scope.responseHandler = function(promise) {
          promise.then(scope.successHandler, scope.errorHandler);
        };
      }
    };
  }]);
