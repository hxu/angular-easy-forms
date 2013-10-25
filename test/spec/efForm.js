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
      expect(formScope.resourceObj).toBeDefined();
      expect(efUtils.isRestangularResource(formScope.resourceObj)).toBeTruthy();
      expect(formScope.resourceObj.route).toEqual('foo');
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

      expect(formScope.resourceObj).toBeDefined();
      expect(formScope.resourceObj.route).toEqual('foo');
      expect(formScope.isCollection).toBeTruthy();
    });

    it('should update the resourceObj when the efResource changes', function () {
      elem = angular.element(
        '<form name="testForm" ef-form ef-resource="testResource"></form>'
      );
      scope = $rootScope.$new();
      scope.testResource = Restangular.all('foo');
      $compile(elem)(scope);
      formScope = elem.scope();
      expect(formScope.resourceObj.route).toEqual('foo');

      scope.testResource = Restangular.all('bar');
      scope.$apply();
      expect(formScope.resourceObj.route).toEqual('bar');
    });

    it('should create a new object as the form model', function() {
      expect(formScope.model).toBeDefined();
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
      expect(formScope.model).toEqual(formScope.resourceObj);
    });

    it('should create a copy of the resource if passed a RestangularElement', function() {
      expect(formScope.model.route).toEqual('foo');
      formScope.model.bar = 'bar';
      expect(scope.testResource.bar).not.toBeDefined();
      expect(formScope.isCollection).toBeFalsy();
    });

    it('should create a separate copy for pristine state', function () {
      expect(formScope.pristineModel.route).toEqual('foo');
      formScope.model.bar = 'bar';
      expect(formScope.pristineModel).toBeDefined();
    });

    it('should be in edit mode', function() {
      expect(formScope.editMode).toBeTruthy();
    });
  });

  describe('initializing with a config object', function () {

    beforeEach(function() {
      elem = angular.element(
        '<form name="testForm" ef-form ef-resource="foo" ef-config="formConfig"></form>'
      );
      scope = $rootScope.$new();
    });

    it('should merge the efConfig object with the efConfig object in scope', function () {
      scope.formConfig = {
        submitSignal: 'fooSubmit'
      };
      $compile(elem)(scope);
      formScope = elem.scope();
      expect(formScope.efConfig.submitSignal).toEqual('fooSubmit');
    });

  });

  describe('form actions', function () {
    var inputField;

    beforeEach(function() {
      elem = angular.element(
        '<form name="testForm" ef-form ef-resource="foo">' +
          '<input type="text" name="testInput" ng-model="model.test"></input>' +
        '</form>'
      );
      scope = $rootScope.$new();
      $compile(elem)(scope);
      formScope = elem.scope();
      inputField = formScope.form.testInput;
    });

    it('$clearErrors should clear the errors hash', function () {
      formScope.errors = {foo: 'bar'};
      formScope.$clearErrors();
      expect(formScope.errors).toEqual({});
    });

    it('reset should set the form back to pristine', function () {
      inputField.$setViewValue('bar');
      expect(formScope.form.$pristine).toBeFalsy();
      expect(formScope.model.test).toEqual('bar');
      formScope.reset();
      expect(scope.model).toEqual(scope.pristineModel);
      expect(formScope.model.test).not.toBeDefined();
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

    it('reset should keep the resourceObj and model objects in sync', function () {
      elem = angular.element(
        '<form name="testForm" ef-form ef-resource="testResource">' +
          '<input type="text" name="testInput" ng-model="model.test"></input>' +
        '</form>'
      );
      scope = $rootScope.$new();
      scope.testResource = Restangular.one('foo');
      $compile(elem)(scope);
      formScope = elem.scope();
      inputField = formScope.form.testInput;
      expect(formScope.model).toEqual(formScope.resourceObj);

      inputField.$setViewValue('foo');
      expect(formScope.model.test).toEqual(formScope.resourceObj.test);

      formScope.reset();
      expect(formScope.model.test).not.toBeDefined();
      expect(formScope.resourceObj.test).not.toBeDefined();
    });

    it('submit should emit efSubmit signal', function () {
      spyOn(formScope, '$emit');
      formScope.submit();
      expect(formScope.$emit).toHaveBeenCalledWith('efFormSubmit');
    });

    it('submit should call $clearErrors', function () {
      spyOn(formScope, '$clearErrors');
      formScope.submit();
      expect(formScope.$clearErrors).toHaveBeenCalled();
    });

    it('submit on a collection or new object should POST to the resource', function () {
      spyOn(formScope.resourceObj, 'post');
      spyOn(formScope, 'responseHandler'); // Stub out the response handler
      formScope.submit();
      expect(formScope.resourceObj.post).toHaveBeenCalledWith(formScope.model);
    });

    it('submit on an element should PUT to the resource', function () {
      elem = angular.element(
        '<form name="testForm" ef-form ef-resource="testResource">' +
          '<input type="text" name="testInput" ng-model="model.test"></input>' +
        '</form>'
      );
      scope = $rootScope.$new();
      scope.testResource = Restangular.one('foo');
      $compile(elem)(scope);
      formScope = elem.scope();
      inputField = formScope.form.testInput;

      spyOn(formScope.resourceObj, 'put');
      spyOn(formScope, 'responseHandler'); // Stub out the response handler
      formScope.submit();
      expect(formScope.resourceObj.put).toHaveBeenCalled();
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

      it('submit with error should populate the error hash', function () {
        $httpBackend.expect('POST', '/foo', {}).respond(400, {test: 'must be filled out'});
        formScope.submit();
        $httpBackend.flush();
        expect(formScope.errors.test).toEqual(['must be filled out']);
      });

      it('submit with error should emit efSubmitError signal', function () {
        $httpBackend.expect('POST', '/foo', {}).respond(400);
        spyOn(formScope, '$emit');
        formScope.submit();
        $httpBackend.flush();
        expect(formScope.$emit).toHaveBeenCalledWith('efFormSubmitError');
      });
    });
  });

  describe('form styles', function() {

    it('should be in basic mode by default', function () {
      elem = angular.element(
        '<form name="testForm" ef-form ef-resource="foo"></form>'
      );
      scope = $rootScope.$new();
      $compile(elem)(scope);
      formScope = elem.scope();
      expect(formScope.formStyle).toEqual('basic');
    });

    it('should add form-inline class when inline', function () {
      elem = angular.element(
        '<form name="testForm" ef-form ef-resource="foo" ef-style="inline"></form>'
      );
      scope = $rootScope.$new();
      $compile(elem)(scope);
      formScope = elem.scope();
      expect(formScope.formStyle).toEqual('inline');
      expect(elem.hasClass('form-inline')).toBeTruthy();
    });

    it('should add form-horizontal class when horizontal', function () {
      elem = angular.element(
        '<form name="testForm" ef-form ef-resource="foo" ef-style="horizontal"></form>'
      );
      scope = $rootScope.$new();
      $compile(elem)(scope);
      formScope = elem.scope();
      expect(formScope.formStyle).toEqual('horizontal');
      expect(elem.hasClass('form-horizontal')).toBeTruthy();
    });

  });
});