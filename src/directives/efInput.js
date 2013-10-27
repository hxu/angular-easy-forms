'use strict';

angular.module('easyForms').

  /**
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
          // ensure the input has class 'form-control'
          classArray.push('form-control');
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