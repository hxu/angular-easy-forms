'use strict';

angular.module('easyForms').
  directive('efForm', ['easyForm', function(easyForm) {
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
        };

        scope.form = scope[attrs['name']];
        scope.errors = {};
        scope.messages = []; // Something like "Submission successful"
        scope.model = {}; // Data model for the form
        scope.pristineModel = {};

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

        easyForm.extendScope(scope);

        scope.$initialize(scope.efResource, attrs);
        scope.$watch('efResource', function(newVal) {
          scope.$initialize(newVal, attrs);
        });

        scope.$on(scope.efConfig.triggerResetSignal, function() {scope.reset(scope)});
      }
    };
  }]);
