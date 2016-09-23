'use strict';

describe('Directive: selectable', function () {

  // load the directive's module
  beforeEach(module('cadrageApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<selectable></selectable>');
    element = $compile(element)(scope);
    expect(element.text()).to.equal('this is the selectable directive');
  }));
});
