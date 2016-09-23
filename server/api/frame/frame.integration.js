'use strict';

var app = require('../..');
import request from 'supertest';

var newFrame;

describe('Frame API:', function() {

  describe('GET /api/frame/:id?', function() {
    var frames;

    beforeEach(function(done) {
      request(app)
        .get('/api/frame/:id?')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          frames = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(frames).to.be.instanceOf(Array);
    });

  });

  describe('POST /api/frame/:id?', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/frame/:id?')
        .send({
          name: 'New Frame',
          info: 'This is the brand new frame!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newFrame = res.body;
          done();
        });
    });

    it('should respond with the newly created frame', function() {
      expect(newFrame.name).to.equal('New Frame');
      expect(newFrame.info).to.equal('This is the brand new frame!!!');
    });

  });

  describe('GET /api/frame/:id?/:id', function() {
    var frame;

    beforeEach(function(done) {
      request(app)
        .get('/api/frame/:id?/' + newFrame._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          frame = res.body;
          done();
        });
    });

    afterEach(function() {
      frame = {};
    });

    it('should respond with the requested frame', function() {
      expect(frame.name).to.equal('New Frame');
      expect(frame.info).to.equal('This is the brand new frame!!!');
    });

  });

  describe('PUT /api/frame/:id?/:id', function() {
    var updatedFrame;

    beforeEach(function(done) {
      request(app)
        .put('/api/frame/:id?/' + newFrame._id)
        .send({
          name: 'Updated Frame',
          info: 'This is the updated frame!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedFrame = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedFrame = {};
    });

    it('should respond with the updated frame', function() {
      expect(updatedFrame.name).to.equal('Updated Frame');
      expect(updatedFrame.info).to.equal('This is the updated frame!!!');
    });

  });

  describe('DELETE /api/frame/:id?/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/frame/:id?/' + newFrame._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when frame does not exist', function(done) {
      request(app)
        .delete('/api/frame/:id?/' + newFrame._id)
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
