'use strict';

describe('Directive: imagestable', function () {

  // load the directive's module and view
  beforeEach(module('cadrageApp'));
  beforeEach(module('components/imagestable/imagestable.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<imagestable></imagestable>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).to.equal('this is the imagestable directive');
  }));
});
