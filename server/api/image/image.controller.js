/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/images              ->  index
 * POST    /api/images              ->  create
 * GET     /api/images/:id          ->  show
 * PUT     /api/images/:id          ->  update
 * DELETE  /api/images/:id          ->  destroy
 */

'use strict';
import csv from 'express-csv';
import _ from 'lodash';
import Image from './image.model';


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Images
export function index(req, res) {
  if (req.query.csv !== undefined) {
    Image.find().exec()
    .then((entities)=>{
      const keys = Object.keys(entities[0]._doc);
      const table = [keys].concat(
        entities.map(entity =>
          keys.map(key => entity._doc[key]
        )
      )
      );
      console.log('rendering to csv');
      res.csv(table);
    })
    .catch(handleError(res));
  } else return Image.find().exec()
    .then((entities) => {
      return res.status(200).json(entities);
    })
    .catch(handleError(res));
}

// Gets a single Image from the DB
export function show(req, res) {
  return Image.findById(req.params.id, (err, data)=>{
    if (err){
      return res.status(500).send(err);
    }else return res.status(200).send(data)
  })
  /*.exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
    */
}

// Creates a new Image in the DB
export function create(req, res) {
  return Image.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Image in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Image.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Image from the DB
export function destroy(req, res) {
  return Image.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
