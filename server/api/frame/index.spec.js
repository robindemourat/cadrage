'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var frameCtrlStub = {
  index: 'frameCtrl.index',
  show: 'frameCtrl.show',
  create: 'frameCtrl.create',
  update: 'frameCtrl.update',
  destroy: 'frameCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var frameIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './frame.controller': frameCtrlStub
});

describe('Frame API Router:', function() {

  it('should return an express router instance', function() {
    expect(frameIndex).to.equal(routerStub);
  });

  describe('GET /api/frame/:id?', function() {

    it('should route to frame.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'frameCtrl.index')
        ).to.have.been.calledOnce;
    });

  });

  describe('GET /api/frame/:id?/:id', function() {

    it('should route to frame.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'frameCtrl.show')
        ).to.have.been.calledOnce;
    });

  });

  describe('POST /api/frame/:id?', function() {

    it('should route to frame.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'frameCtrl.create')
        ).to.have.been.calledOnce;
    });

  });

  describe('PUT /api/frame/:id?/:id', function() {

    it('should route to frame.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'frameCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('PATCH /api/frame/:id?/:id', function() {

    it('should route to frame.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'frameCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('DELETE /api/frame/:id?/:id', function() {

    it('should route to frame.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'frameCtrl.destroy')
        ).to.have.been.calledOnce;
    });

  });

});
