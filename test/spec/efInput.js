'use strict';

describe('efForm', function() {
  var elem, scope, formScope
  var $compile, $rootScope, efUtils, Restangular;
  var inputField;

  beforeEach(function() {
    module('easyForms')
  });

  beforeEach(inject(function(_$rootScope_, _$compile_, _efUtils_, _Restangular_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    efUtils = _efUtils_;
    Restangular = _Restangular_;

    elem = angular.element(
      '<form name="testForm" ef-form ef-resource="foo">' +
        '<input type="text" name="testInput" ef-input></input>' +
        '</form>'
    );
    scope = $rootScope.$new();
    $compile(elem)(scope);
    formScope = elem.scope();
  }));


//  it('should set the inputs ngModel to model.{name}', function () {
//    console.log(elem);
//    inputField = formScope.form.testInput;
//    console.log(formScope.form);
//    console.log(inputField);
//    inputField.$setViewValue('bar');
//    expect(formScope.model.testInput).toEqual('bar');
//  });

});
