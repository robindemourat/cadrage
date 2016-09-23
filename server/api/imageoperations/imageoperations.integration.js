'use strict';

var app = require('../..');
import request from 'supertest';

var newListimages;

describe('Listimages API:', function() {

  describe('GET /api/listimages', function() {
    var listimagess;

    beforeEach(function(done) {
      request(app)
        .get('/api/listimages')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          listimagess = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(listimagess).to.be.instanceOf(Array);
    });

  });

  describe('POST /api/listimages', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/listimages')
        .send({
          name: 'New Listimages',
          info: 'This is the brand new listimages!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newListimages = res.body;
          done();
        });
    });

    it('should respond with the newly created listimages', function() {
      expect(newListimages.name).to.equal('New Listimages');
      expect(newListimages.info).to.equal('This is the brand new listimages!!!');
    });

  });

  describe('GET /api/listimages/:id', function() {
    var listimages;

    beforeEach(function(done) {
      request(app)
        .get('/api/listimages/' + newListimages._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          listimages = res.body;
          done();
        });
    });

    afterEach(function() {
      listimages = {};
    });

    it('should respond with the requested listimages', function() {
      expect(listimages.name).to.equal('New Listimages');
      expect(listimages.info).to.equal('This is the brand new listimages!!!');
    });

  });

  describe('PUT /api/listimages/:id', function() {
    var updatedListimages;

    beforeEach(function(done) {
      request(app)
        .put('/api/listimages/' + newListimages._id)
        .send({
          name: 'Updated Listimages',
          info: 'This is the updated listimages!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedListimages = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedListimages = {};
    });

    it('should respond with the updated listimages', function() {
      expect(updatedListimages.name).to.equal('Updated Listimages');
      expect(updatedListimages.info).to.equal('This is the updated listimages!!!');
    });

  });

  describe('DELETE /api/listimages/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/listimages/' + newListimages._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when listimages does not exist', function(done) {
      request(app)
        .delete('/api/listimages/' + newListimages._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
