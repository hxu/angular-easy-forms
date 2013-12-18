'use strict';

describe('efInput', function() {
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
        '<input type="text" name="testInput" ef-input ef-label="Label" class="bar" placeholder="fooPlaceholder"></input>' +
        '</form>'
    );
    scope = $rootScope.$new();
    $compile(elem)(scope);
    formScope = elem.scope();
    inputField = formScope.form.testInput;
  }));

  it('should set the label text based on efLabel', function () {
    var label = elem.find('label');
    expect(label.length).not.toEqual(0);
    expect(label.html()).toEqual('Label');
  });

  it('should have the form-control class', function () {
    expect(elem.find('input').hasClass('form-control')).toBeTruthy();
  });

  it('should not create a label tag if efLabel is null', function () {
    elem = angular.element(
      '<form name="testForm" ef-form ef-resource="foo">' +
        '<input type="text" name="testInput" ef-input placeholder="fooPlaceholder"></input>' +
        '</form>'
    );

    scope = $rootScope.$new();
    $compile(elem)(scope);
    var label = elem.find('label');
    expect(_.isEmpty(label)).toBeTruthy();
  });

  it('should copy the classes into the input', function () {
    expect(elem.find('input').hasClass('bar')).toBeTruthy();
    expect(elem.find('input').hasClass('form-group')).toBeFalsy();
  });

  it('should infer name if only id is provided', function () {
    elem = angular.element(
      '<form name="testForm" ef-form ef-resource="foo">' +
        '<input type="text" ef-input id="fooField" ef-label="foo label"></input>' +
        '</form>'
    );
    scope = $rootScope.$new();
    $compile(elem)(scope);
    var inputElem = elem.find('input');
    var labelElem = elem.find('label');
    expect(inputElem.attr('name')).toEqual('fooField');
    expect(labelElem.attr('for')).toEqual('fooField');
  });

  it('should infer id if only name is provided', function () {
    elem = angular.element(
      '<form name="testForm" ef-form ef-resource="foo">' +
        '<input type="text" ef-input name="fooField" ef-label="foo label"></input>' +
        '</form>'
    );
    scope = $rootScope.$new();
    $compile(elem)(scope);
    var inputElem = elem.find('input');
    var labelElem = elem.find('label');
    expect(inputElem.attr('id')).toEqual('fooField');
    expect(labelElem.attr('for')).toEqual('fooField');
  });

  it('should throw and error if neither id nor name is provided', function () {
    elem = angular.element(
      '<form name="testForm" ef-form ef-resource="foo">' +
        '<input type="text" ef-input></input>' +
        '</form>'
    );
    scope = $rootScope.$new();
    expect(function(){
      $compile(elem)(scope);
    }).toThrow();
  });

  it('should copy over the placeholder', function () {
    var inputElem = elem.find('input');
    expect(inputElem.attr('placeholder')).toEqual('fooPlaceholder');
  });

  it('should set the inputs ngModel to model.{name}', function () {
    expect(inputField).toBeDefined();
    inputField.$setViewValue('bar');
    expect(formScope.model.testInput).toEqual('bar');
  });

  it('should respect ngModel if it is specified', function () {
    elem = angular.element(
      '<form name="testForm" ef-form ef-resource="foo">' +
        '<input type="text" ef-input name="fooField" ng-model="model.otherField"></input>' +
        '</form>'
    );
    scope = $rootScope.$new();
    $compile(elem)(scope);
    var inputElem = elem.find('input');
    expect(inputElem.attr('ng-model')).toEqual('model.otherField');
  });

  it('should move attributes to the input and remove them from the containing div', function() {
    elem = angular.element(
      '<form name="testForm" ef-form ef-resource="foo">' +
        '<input type="text" name="testInput" ef-input ef-label="Label" class="bar" placeholder="fooPlaceholder" some-attribute></input>' +
        '</form>'
    );

    scope = $rootScope.$new();
    $compile(elem)(scope);
    formScope = elem.scope();
    inputField = formScope.form.testInput;
    var inputElem = elem.find('input');
    var containingDiv = elem.find('div');
    expect(inputElem.attr('some-attribute')).toBeDefined();
    expect(containingDiv.attr('some-attribute')).not.toBeDefined();
  })

});
