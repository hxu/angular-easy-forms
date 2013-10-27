'use strict';

describe('easyForm service', function() {
  var easyForm, $compile, $rootScope;


  describe('config defaults', function() {
    beforeEach(module('easyForms', function(easyFormProvider) {
      easyFormProvider.overrideDefault('successMessage', 'foo!');
    }));

    it('should respect configuration overrides', inject(function (easyForm, $rootScope) {
      var scope = $rootScope.$new();
      easyForm.extendScope(scope);
      scope.$initialize('foo', {});
      expect(scope.efConfig.successMessage).toEqual('foo!');
    }));

  });

  it('should extend a scope with form handling functions', function () {

  });

});
