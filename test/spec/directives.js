'use strict';

describe('efForm', function() {
  var elem, scope, formScope;

  beforeEach(function() {
    module('easyForms')
  });

  beforeEach(inject(function($rootScope, $compile) {
    elem = angular.element(
      '<form name="testForm" ef-form ef-resource="/foo"></form>'
    );
    scope = $rootScope.$new();
    scope.foo = 'foo';
    $compile(elem)(scope);
    formScope = elem.scope();
  }));

  describe('without existing model', function() {

  });

  describe('with existing resource object', function() {

  });

  it('should convert a url to a resource', inject(function($rootScope, $compile) {
    elem = angular.element(
      '<form name="testForm" ef-form ef-resource="/foo"></form>'
    );
    scope = $rootScope.$new();
    $compile(elem)(scope);
    formScope = elem.scope();

    expect(formScope.efResource).toBeDefined();
    expect(formScope.efResource.save).toBeDefined();
  }));

  it('should accept a resource object', inject(function($rootScope, $compile, $resource) {
    elem = angular.element(
      '<form name="testForm" ef-form ef-resource="testResource"></form>'
    );
    scope = $rootScope.$new();
    scope.testResource = $resource('/foo');
    $compile(elem)(scope);
    formScope = elem.scope();

    expect(formScope.efResource).toBeDefined();
    expect(formScope.efResource.save).toBeDefined();
  }));

  it('should create an isolate scope', function() {
    expect(formScope.foo).not.toBeDefined();
  });

  it('should alias the form controller to form', function() {
    expect(formScope.form).toBeDefined();
    expect(formScope.form.$valid).toBeTruthy();
  });

  it('should create a form model', function() {
    expect(formScope.efModel).toBeDefined();
  });

});