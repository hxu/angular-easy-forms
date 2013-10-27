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

    this.overrideDefault = function(param, value) {
      if (defaultConfig[param] != undefined) {
        defaultConfig[param] = value;
      }
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
          this.form = this[attrs['name']];
          this.errors = {};
          this.messages = []; // Something like "Submission successful"
          this.model = {}; // Data model for the form
          this.pristineModel = {};

          // Variables holding the state of the form
          this.editMode = false;
          this.isCollection = true;


          if (resource == undefined || !efUtils.isRestangularResource(resource)) {
            this.resourceObj = Restangular.all(attrs.efResource);
          } else {
            if (efUtils.isRestangularCollection(resource)) {
              this.resourceObj = resource;
            } else { //noinspection JSValidateTypes
              {
                            // Will a PUT be made on the efResource or the model object?
                            this.resourceObj = Restangular.copy(resource);
                            this.model = this.resourceObj;
                            this.pristineModel = Restangular.copy(this.resourceObj); // Need a separate copy to store pristine state
                            this.isCollection = false;
                            this.editMode = true;
                          }
            }
          }
          // Merging in the configuration options
          var parentConfig = $parse(attrs.efConfig)(this.$parent);
          if (parentConfig != undefined && _.isObject(parentConfig)) {
            this.efConfig = angular.extend(defaultConfig, parentConfig);
          } else {
            this.efConfig = defaultConfig;
          }

          scope.$on(scope.efConfig.triggerResetSignal, function() {scope.reset(scope)});
        },

        hasErrors: function() {
          return !_.isEmpty(this.errors);
        },

        hasMessages: function() {
          return this.messages.length > 0;
        },

        $clearMessages: function() {
          this.messages.length = 0;
        },

        $clearErrors: function() {
          this.errors = {};
        },

        canSave: function() {
          return !this.form.$pristine && this.form.$valid;
        },

        canRevert: function() {
          return !this.form.$pristine;
        },

        reset: function() {
          if (efUtils.isRestangularResource(this.model)) {
            this.model = this.resourceObj = Restangular.copy(this.pristineModel);
          } else {
            this.model = angular.copy(this.pristineModel);
          }
          this.$clearMessages();
          this.$clearErrors();
          this.form.$setPristine();
          this.$emit(this.efConfig.resetSignal);
        },

        submit: function() {
          var promise;

          this.$clearErrors();

          if (this.editMode) {
            promise = this.resourceObj.put();
          } else {
            promise = this.resourceObj.post(this.model);
          }
          this.$emit(this.efConfig.submitSignal);
          this.responseHandler(promise);
        },

        successHandler: function() {
          this.messages.push(this.efConfig.successMessage);
          this.$emit(this.efConfig.successSignal);
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