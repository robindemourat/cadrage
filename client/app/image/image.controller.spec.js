'use strict';

describe('Component: ImageComponent', function () {

  // load the controller's module
  beforeEach(module('cadrageImage'));

  var ImageComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    ImageComponent = $componentController('image', {});
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
