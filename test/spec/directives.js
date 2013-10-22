'use strict';

describe('efForm', function() {
  var elem, scope, formScope;

  beforeEach(function() {
    module('easyForms')
  });

  beforeEach(inject(function($rootScope, $compile) {
    elem = angular.element(
      '<form name="testForm" ef-form ef-resource-url="/foo"></form>'
    );
    scope = $rootScope.$new();
    $compile(elem)(scope);
    formScope = elem.scope();
  }));

  it('should attach the form to the isolate scope', function() {
    expect(formScope.form).toBeDefined();
  });

});