'use strict';

describe('efForm', function() {
  var elem, scope, formScope
  var $compile, $rootScope, efUtils, Restangular;

  beforeEach(function() {
    module('easyForms')
  });

  beforeEach(inject(function(_$rootScope_, _$compile_, _efUtils_, _Restangular_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    efUtils = _efUtils_;
    Restangular = _Restangular_;
  }));

  it('should create an isolate scope', function() {
    elem = angular.element(
      '<form name="testForm" ef-form ef-resource="foo"></form>'
    );
    scope = $rootScope.$new();
    scope.foo = 'foo';
    $compile(elem)(scope);
    formScope = elem.scope();
    expect(formScope.foo).not.toBeDefined();
  });

  it('should alias the form controller to form', function() {
    elem = angular.element(
      '<form name="testForm" ef-form ef-resource="foo"></form>'
    );
    scope = $rootScope.$new();
    scope.foo = 'foo';
    $compile(elem)(scope);
    formScope = elem.scope();
    expect(formScope.form).toBeDefined();
    expect(formScope.form.$valid).toBeTruthy();
  });

  describe('initialize in create mode', function() {
    beforeEach(function() {
      elem = angular.element(
        '<form name="testForm" ef-form ef-resource="foo"></form>'
      );
      scope = $rootScope.$new();
      scope.foo = 'foo';
      $compile(elem)(scope);
      formScope = elem.scope();
    });

    it('should convert a url to a resource', function() {
      expect(formScope.efResource).toBeDefined();
      expect(efUtils.isRestangularResource(formScope.efResource)).toBeTruthy();
      expect(formScope.efResource.route).toEqual('foo');
      expect(formScope.isCollection).toBeTruthy();
    });

    it('should accept a RestangularCollection object', function() {
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
    });

    it('should create a new object as the form model', function() {
      expect(formScope.efModel).toBeDefined();
    });

    it('should not be in edit mode', function () {
      expect(formScope.editMode).toBeFalsy();
    });
  });

  describe('initialize in edit mode', function() {
    beforeEach(function() {
      elem = angular.element(
        '<form name="testForm" ef-form ef-resource="testResource"></form>'
      );
      scope = $rootScope.$new();
      scope.testResource = Restangular.one('foo');
      $compile(elem)(scope);
      formScope = elem.scope();
    });

    it('should set the resource as the form model', function() {
      expect(formScope.efModel).toEqual(formScope.efResource);
    });

    it('should create a copy of the resource if passed a RestangularElement', function() {
      expect(formScope.efModel.route).toEqual('foo');
      formScope.efModel.bar = 'bar';
      expect(scope.testResource.bar).not.toBeDefined();
      expect(formScope.isCollection).toBeFalsy();
    });

    it('should create a separate copy for pristine state', function () {
      expect(formScope.pristineModel.route).toEqual('foo');
      formScope.efModel.bar = 'bar';
      expect(formScope.pristineModel).toBeDefined();
    });

    it('should be in edit mode', function() {
      expect(formScope.editMode).toBeTruthy();
    });
  });

  describe('form actions', function () {
    var inputField;

    beforeEach(function() {
      elem = angular.element(
        '<form name="testForm" ef-form ef-resource="foo">' +
          '<input type="text" name="testInput" ng-model="efModel.test"></input>' +
        '</form>'
      );
      scope = $rootScope.$new();
      $compile(elem)(scope);
      formScope = elem.scope();
      inputField = formScope.form.testInput;
    });

    it('reset should set the form back to pristine', function () {
      inputField.$setViewValue('bar');
      expect(formScope.form.$pristine).toBeFalsy();
      expect(formScope.efModel.test).toEqual('bar');
      formScope.reset();
      expect(scope.efModel).toEqual(scope.pristineModel);
      expect(formScope.efModel.test).not.toBeDefined();
      expect(formScope.form.$pristine).toBeTruthy();
    });

    it('reset should emit a signal', function () {
      spyOn(formScope, '$emit');
      formScope.reset();
      expect(formScope.$emit).toHaveBeenCalledWith('efFormReset');
    });

    it('reset can be triggered by a signal', function () {
      spyOn(formScope, 'reset');
      scope.$broadcast('efTriggerFormReset');
      expect(formScope.reset).toHaveBeenCalled();
    });

    it('submit should emit efSubmit signal', function () {
      spyOn(formScope, '$emit');
      formScope.submit();
      expect(formScope.$emit).toHaveBeenCalledWith('efFormSubmit');
    });

    it('submit on a collection or new object should POST to the resource', function () {
      spyOn(formScope.efResource, 'post');
      spyOn(formScope, 'responseHandler'); // Stub out the response handler
      formScope.submit();
      expect(formScope.efResource.post).toHaveBeenCalledWith(formScope.efModel);
    });

    it('submit on an element should PUT to the resource', function () {
      elem = angular.element(
        '<form name="testForm" ef-form ef-resource="testResource">' +
          '<input type="text" name="testInput" ng-model="efModel.test"></input>' +
        '</form>'
      );
      scope = $rootScope.$new();
      scope.testResource = Restangular.one('foo');
      $compile(elem)(scope);
      formScope = elem.scope();
      inputField = formScope.form.testInput;

      spyOn(formScope.efResource, 'put');
      spyOn(formScope, 'responseHandler'); // Stub out the response handler
      formScope.submit();
      expect(formScope.efResource.put).toHaveBeenCalled();
    });

    describe('response handling', function () {
      var $httpBackend;
      beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;
      }));

      it('should pass the response to responseHandler', function () {
        spyOn(formScope, 'responseHandler');
        formScope.submit();
        expect(formScope.responseHandler).toHaveBeenCalled();
      });

      it('submit without error should call the successHandler', function () {
        $httpBackend.expect('POST', '/foo', {test: 'bar'}).respond(201);
        spyOn(formScope, 'successHandler');
        inputField.$setViewValue('bar');
        formScope.submit();
        $httpBackend.flush();
        expect(formScope.successHandler).toHaveBeenCalled();
      });

      it('submit without error should emit efSubmitSuccess signal', function () {
        $httpBackend.expect('POST', '/foo', {}).respond(201);
        spyOn(formScope, '$emit');
        formScope.submit();
        $httpBackend.flush();
        expect(formScope.$emit).toHaveBeenCalledWith('efFormSubmitSuccess');
      });

      it('submit with error should call the errorHandler', function () {
        var errorResp = {error: 'error!'};
        $httpBackend.expect('POST', '/foo', {}).respond(400, errorResp);
        spyOn(formScope, 'errorHandler');
        formScope.submit();
        $httpBackend.flush();
        expect(formScope.errorHandler).toHaveBeenCalled();
      });

      it('submit with error should set form to error state', function () {
        expect(formScope.hasErrors()).toBeFalsy();
        $httpBackend.expect('POST', '/foo', {}).respond(400, {error: 'error!'});
        formScope.submit();
        $httpBackend.flush();
        expect(formScope.hasErrors()).toBeTruthy();
      });

    });
  });
});