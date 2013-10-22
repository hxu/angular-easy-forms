'use strict';

describe('efForm', function() {
  var elem, scope, formScope;

  beforeEach(function() {
    module('easyForms')
  });

  beforeEach(inject(function($rootScope, $compile) {
    elem = angular.element(
      '<form name="testForm" ef-form ef-resource="foo"></form>'
    );
    scope = $rootScope.$new();
    scope.foo = 'foo';
    $compile(elem)(scope);
    formScope = elem.scope();
  }));

  it('should create an isolate scope', function() {
    expect(formScope.foo).not.toBeDefined();
  });

  it('should convert a url to a resource', inject(function($rootScope, $compile, efUtils) {
    elem = angular.element(
      '<form name="testForm" ef-form ef-resource="foo"></form>'
    );
    scope = $rootScope.$new();
    $compile(elem)(scope);
    formScope = elem.scope();

    expect(formScope.efResource).toBeDefined();
    expect(efUtils.isRestangularResource(formScope.efResource)).toBeTruthy();
    expect(formScope.efResource.route).toEqual('foo');
    expect(formScope.isCollection).toBeTruthy();
  }));

  it('should accept a resource object', inject(function($rootScope, $compile, Restangular) {
    elem = angular.element(
      '<form name="testForm" ef-form ef-resource="testResource"></form>'
    );
    scope = $rootScope.$new();
    scope.testResource = Restangular.all('foo');
    $compile(elem)(scope);
    formScope = elem.scope();

    expect(formScope.efResource).toBeDefined();
    expect(formScope.efResource.route).toEqual('foo');
    expect(formScope.isCollection).toBeTruthy();
  }));

  it('should create a copy of Restangular elements', inject(function($rootScope, $compile, Restangular) {
    elem = angular.element(
      '<form name="testForm" ef-form ef-resource="testResource"></form>'
    );
    scope = $rootScope.$new();
    scope.testResource = Restangular.one('foo');
    $compile(elem)(scope);
    formScope = elem.scope();

    expect(formScope.efResource.route).toEqual('foo');
    formScope.efResource.bar = 'bar';
    expect(scope.testResource.bar).not.toBeDefined();
    expect(formScope.isCollection).toBeFalsy();
  }));

  it('should alias the form controller to form', function() {
    expect(formScope.form).toBeDefined();
    expect(formScope.form.$valid).toBeTruthy();
  });

  it('should create a form model', function() {
    expect(formScope.efModel).toBeDefined();
  });

});