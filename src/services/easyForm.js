'use strict';

/*
 * @ngdoc service
 * @description This service encapsulates all of the functions used by the easyForm directives.
 * These have been broken out into this service instead of being put into the directive directly so that users don't
 * have to use the directive in order to use some of the functions
 */

angular.module('easyForms').
  provider('easyForm', function() {

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

    //noinspection JSValidateTypes
    this.$get = ['efUtils', 'Restangular', '$parse', function(efUtils, Restangular, $parse) {

      var svc = {

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

        $initialize: function(scope, resource, attrs) {
          if (resource == undefined || !efUtils.isRestangularResource(resource)) {
            scope.resourceObj = Restangular.all(attrs.efResource);
          } else {
            if (efUtils.isRestangularCollection(resource)) {
              scope.resourceObj = resource;
            } else { //noinspection JSValidateTypes
              {
                            // Will a PUT be made on the efResource or the model object?
                            scope.resourceObj = Restangular.copy(resource);
                            scope.model = scope.resourceObj;
                            scope.pristineModel = Restangular.copy(scope.resourceObj); // Need a separate copy to store pristine state
                            scope.isCollection = false;
                            scope.editMode = true;
                          }
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
          scope.$clearMessages(scope);
          scope.$clearErrors(scope);
          scope.form.$setPristine();
          scope.$emit(scope.efConfig.resetSignal);
        },

        submit: function(scope) {
          var promise;

          scope.$clearErrors(scope);

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

      return svc;
    }];

  });