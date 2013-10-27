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
