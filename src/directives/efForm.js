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
        // This watch actually NEEDS to be here.  There is an issue with timing where some of the components on the scope
        // Are not ready yet if you just $initialize.  You need to $initialize once, so that the messages and model objects
        // Exist on the scope (otherwise you will get some harmless errors), then you need to initialize again when the scope is
        // ready.
        scope.$watch('efResource', function(newVal) {
          scope.$initialize(newVal, attrs);
        });

      }
    };
  }]);
