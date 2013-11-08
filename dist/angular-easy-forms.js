/**
 * AngularEasyForms - Basic CRUD operation handling in a box
 * @version v0.1.0 - 2013-10-27
 * @link http://github.com/hxu/angular-easy-forms
 * @author Han Xu
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

/**
 * @doc module
 * @name easyForms
 *
 * @description
 * Module for handling basic CRUD functionality of forms.
 *
 * Implements:
 *  - CRUD behaviors
 *  - Error handling
 *  - Basic styling with Bootstrap
 */

angular.module('easyForms', ['restangular']);

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
'use strict';

angular.module('easyForms').
  directive('efForm', ['easyForm', function(easyForm) {
    return {
      scope: {
        efResource: '='
      },
      require: '^form',
      link: function(scope, elem, attrs, controller) {
        // Configure the form style
        scope.formStyle = attrs.efStyle || 'basic';
        var formStyleClass = {
          basic: null,
          inline: 'form-inline',
          horizontal: 'form-horizontal'
        };

        if (formStyleClass[scope.formStyle] != null) {
          elem.addClass(formStyleClass[scope.formStyle]);
        }

        // Extend and initialize the scope
        easyForm.extendScope(scope);
        scope.$initialize(scope.efResource, attrs);
        scope.$watch('efResource', function(newVal) {
          scope.$initialize(newVal, attrs);
        });

      }
    };
  }]);

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
            '<label>' + attrs.efLabel + '</label>';

        if (attrs.ngModel != undefined) {
          newElem += '<input ng-model="' + attrs.ngModel + '">';
        } else {
          newElem += '<input ng-model="model.' + attrs.name + '">';
        }
          newElem += '</div>';
        return newElem;
      },
      compile: function(elem, attrs) {
        var inputElem = elem.find('input');
        var labelElem = elem.find('label');

        // configure id and name
        if (attrs.name == undefined && attrs.id == undefined) {
          throw 'efInput - must provide either id or name';
        } else {
          if (attrs.id == undefined) {
            inputElem.attr('name', attrs.name);
            inputElem.attr('id', attrs.name);
          } else if (attrs.name == undefined) {
            inputElem.attr('name', attrs.id);
            inputElem.attr('id', attrs.id);
          } else {
            // What to do if id and name are both provided by don't agree?
          }
        }

        // Add for the to the label
        labelElem.attr('for', inputElem.attr('id'));

        // Transfer classes to the input
        var getClasses = function(classStr) {
          var classArray = classStr.split(' ');
          // remove empty strings
          classArray = _.compact(classArray);
          // remove duplicates
          classArray = _.uniq(classArray);
          // remove special classes added to the div
          classArray = _.without(classArray, 'form-group');
          return classArray;
        };
        angular.forEach(getClasses(attrs.class), function(cls) {
          inputElem.addClass(cls);
        });

        // Copy over other attributes
        angular.forEach(attrs.$attr, function(tag, attr) {
          var excludedTags = ['name', 'id', 'class', 'ng-model'];
          if (excludedTags.indexOf(tag) == -1 && tag.substring(0, 3) != 'ef-') {
            var tagVal = attrs[attr];
            inputElem.attr(tag, tagVal);
          }
        });
      }
    };
  });
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
'use strict';

angular.module('easyForms').
  factory('efUtils', function() {

    var utils = {};

    utils.isResource = function(obj) {
      return obj.save != undefined && obj.query != undefined && obj.get != undefined;
    };

    utils.isRestangularResource = function(obj) {
      return obj.restangularCollection != undefined;
    };

    utils.isRestangularCollection = function(obj) {
      return obj.restangularCollection == true;
    };

    return utils;

  });