'use strict';

describe('easyForm service', function() {

  describe('load time configuration and scope extending', function() {
    describe('config defaults', function() {
      beforeEach(module('easyForms', function(easyFormProvider) {
        easyFormProvider.overrideDefault('successMessage', 'foo!');
      }));

      it('should respect configuration overrides', inject(function(easyForm, $rootScope) {
        var scope = $rootScope.$new();
        easyForm.extendScope(scope);
        scope.$initialize('foo', {});
        expect(scope.efConfig.successMessage).toEqual('foo!');
      }));
    });
  });

  describe('form instance configuration', function() {
    var scope;

    beforeEach(function() {
      module('easyForms')
    });

    beforeEach(inject(function(easyForm, $rootScope) {
      scope = $rootScope.$new();
      easyForm.extendScope(scope);
    }));

    it('should extend a scope with form handling functions', function () {
      scope.$initialize('foo', {});
      expect(scope.submit).toBeDefined();
      expect(scope.reset).toBeDefined();
    });

    it('should allow overriding success message from the attributes', function () {
      var attrs = {
        efSuccessMessage: 'Custom message'
      };
      scope.$initialize('foo', attrs);
      expect(scope.efConfig.successMessage).toEqual('Custom message');
    });

    it('should allow overriding error message from the attributes', function () {
      var attrs = {
        efErrorMessage: 'Custom message'
      };
      scope.$initialize('foo', attrs);
      expect(scope.efConfig.errorMessage).toEqual('Custom message');
    });
  });

  describe('form state', function() {
    var scope;

    beforeEach(function() {
      module('easyForms')
    });

    beforeEach(inject(function(easyForm, $rootScope) {
      scope = $rootScope.$new();
      easyForm.extendScope(scope);
      scope.$initialize('foo', {});
      scope.form = jasmine.createSpyObj('form', ['$pristine', '$valid']);
    }));

    it('canSubmit should be true when the form has been changed and is valid', function () {
      scope.form.$pristine = true;
      scope.form.$valid = false;
      expect(scope.canSubmit()).toBeFalsy();
      scope.form.$pristine = false;
      scope.form.$valid = true;
      expect(scope.canSubmit()).toBeTruthy();
    });

    it('canReset should be true when the has been changed', function () {
      scope.form.$pristine = true;
      expect(scope.canReset()).toBeFalsy();
      scope.form.$pristine = false;
      expect(scope.canReset()).toBeTruthy();
    });

    it('hasMessages should be true if the messages array is populated', function () {
      scope.messages = [];
      expect(scope.hasMessages()).toBeFalsy();
      scope.messages = ['foo'];
      expect(scope.hasMessages()).toBeTruthy();
    });

    it('hasErrors should be true if the errors hash is not empty', function () {
      scope.errors = {};
      expect(scope.hasErrors()).toBeFalsy();
      scope.errors = {email: 'required'};
      expect(scope.hasErrors()).toBeTruthy();
    });

    it('hasFieldError should be true if a field has an error', function() {
      scope.errors = {foo: 'bar'};
      expect(scope.hasFieldError("baz")).toBeFalsy();
      scope.errors = {baz: ['blah']};
      expect(scope.hasFieldError("baz")).toBeTruthy();
    });

    it('getFieldError should handle strings and arrays', function() {
      scope.errors = {foo: 'bar'};
      expect(scope.getFieldError('foo')).toEqual('bar');
      scope.errors = {foo: ['bar', 'baz']};
      expect(scope.getFieldError('foo')).toEqual('bar baz');

    });
  });

  describe('form actions', function() {
    var scope;

    beforeEach(function() {
      module('easyForms')
    });

    beforeEach(inject(function(easyForm, $rootScope) {
      scope = $rootScope.$new();
      easyForm.extendScope(scope);
      scope.$initialize('foo', {});
      scope.form = jasmine.createSpyObj('form', ['$pristine', '$valid']);
    }));

  })
});
