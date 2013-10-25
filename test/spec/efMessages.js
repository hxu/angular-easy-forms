'use strict';

describe('efForm', function() {
  var elem, scope, formScope
  var $compile, $rootScope, efUtils, Restangular;
  var messageDiv;

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
        '<div ef-messages></div>' +
        '</form>'
    );
    scope = $rootScope.$new();
    $compile(elem)(scope);
    formScope = elem.scope();
    messageDiv = elem.find('div');
  }));

  it('should be hidden when there are no messages', function () {
    scope.$apply();
    expect(messageDiv.hasClass('ng-hide')).toBeTruthy();
  });

  it('should be visible when there are messages', function () {
    formScope.messages.push('foo');
    scope.$apply();
    expect(messageDiv.hasClass('ng-hide')).toBeFalsy();
  });

});