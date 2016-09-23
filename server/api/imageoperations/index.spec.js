'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var listimagesCtrlStub = {
  index: 'listimagesCtrl.index',
  show: 'listimagesCtrl.show',
  create: 'listimagesCtrl.create',
  update: 'listimagesCtrl.update',
  destroy: 'listimagesCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var listimagesIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './listimages.controller': listimagesCtrlStub
});

describe('Listimages API Router:', function() {

  it('should return an express router instance', function() {
    expect(listimagesIndex).to.equal(routerStub);
  });

  describe('GET /api/listimages', function() {

    it('should route to listimages.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'listimagesCtrl.index')
        ).to.have.been.calledOnce;
    });

  });

  describe('GET /api/listimages/:id', function() {

    it('should route to listimages.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'listimagesCtrl.show')
        ).to.have.been.calledOnce;
    });

  });

  describe('POST /api/listimages', function() {

    it('should route to listimages.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'listimagesCtrl.create')
        ).to.have.been.calledOnce;
    });

  });

  describe('PUT /api/listimages/:id', function() {

    it('should route to listimages.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'listimagesCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('PATCH /api/listimages/:id', function() {

    it('should route to listimages.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'listimagesCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('DELETE /api/listimages/:id', function() {

    it('should route to listimages.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'listimagesCtrl.destroy')
        ).to.have.been.calledOnce;
    });

  });

});
