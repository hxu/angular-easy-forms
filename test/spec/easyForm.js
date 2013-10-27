'use strict';

describe('easyForm service', function() {

  describe('configuration and scope extending', function() {
    it('should extend a scope with form handling functions', function () {
    });

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

    it('canSave should be true when the form has been changed and is valid', function () {
      scope.form.$pristine = true;
      scope.form.$valid = false;
      expect(scope.canSave()).toBeFalsy();
      scope.form.$pristine = false;
      scope.form.$valid = true;
      expect(scope.canSave()).toBeTruthy();
    });

    it('canRevert should be true when the has been changed', function () {
      scope.form.$pristine = true;
      expect(scope.canRevert()).toBeFalsy();
      scope.form.$pristine = false;
      expect(scope.canRevert()).toBeTruthy();
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
  });
});
