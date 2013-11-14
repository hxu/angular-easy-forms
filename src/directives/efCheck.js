'use strict';

angular.module('easyForms').

  /**
   * @ngdoc directive
   * @name easyForms.efCheck
   *
   * @description use as an attribute on a set of checkboxes
   */

  directive('efCheck', function() {
    return {
      replace: true,
      template: function(elem, attrs) {
        // Only use the template function to attach ng-model
        // Other classes are attached in the compile function
        var newElem = '<div class="checkbox" ng-class="{\'has-error\': hasFieldError(\'' + attrs.name + '\')}">';

        newElem += '<label>';

        if (attrs.ngModel != undefined) {
          newElem += '<input type="checkbox" ng-model="' + attrs.ngModel + '">';
        } else {
          newElem += '<input type="checkbox" ng-model="model.' + attrs.name + '">';
        }
        if (attrs.efLabel) {
          newElem += attrs.efLabel + '</label>';
        }
        newElem += '<p class="help-block" ng-show="hasFieldError(\'' + attrs.name + '\')">' +
          '{{ getFieldError(\'' + attrs.name + '\') }}' +
          '</p>';

        newElem += '</div>';
        return newElem;
      },
      compile: function(elem, attrs) {
        var checkElem = elem.find('input');
        var labelElem = elem.find('label');

        // configure id and name
        if (attrs.name == undefined && attrs.id == undefined) {
          throw 'efInput - must provide either id or name';
        } else {
          if (attrs.id == undefined) {
            checkElem.attr('name', attrs.name);
            checkElem.attr('id', attrs.name);
          } else if (attrs.name == undefined) {
            checkElem.attr('name', attrs.id);
            checkElem.attr('id', attrs.id);
          } else {
            // What to do if id and name are both provided by don't agree?
          }
        }

        // Add for the to the label
//        labelElem.attr('for', checkElem.attr('id'));
//        labelElem.addClass('control-label');

        // Transfer classes to the input
        var getClasses = function(classStr) {
          var classArray = classStr.split(' ');
          // ensure the input has class 'form-control'
//          classArray.push('form-control');
          // remove empty strings
          classArray = _.compact(classArray);
          // remove duplicates
          classArray = _.uniq(classArray);
          // remove special classes added to the div
          classArray = _.without(classArray, 'checkbox');
          return classArray;
        };
        angular.forEach(getClasses(attrs.class), function(cls) {
          checkElem.addClass(cls);
        });

        // Copy over other attributes
        angular.forEach(attrs.$attr, function(tag, attr) {
          var excludedTags = ['name', 'id', 'class', 'ng-model'];
          if (excludedTags.indexOf(tag) == -1 && tag.substring(0, 3) != 'ef-') {
            var tagVal = attrs[attr];
            checkElem.attr(tag, tagVal);
          }
        });
      }
    };
  });