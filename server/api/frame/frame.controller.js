/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/frame/:id?              ->  index
 * POST    /api/frame/:id?              ->  create
 * GET     /api/frame/:id?/:id          ->  show
 * PUT     /api/frame/:id?/:id          ->  update
 * DELETE  /api/frame/:id?/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import { mapSeries } from 'async';

import Frame from './frame.model';
import Image from '../image/image.model';

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

// Gets a list of Frames
export function index(req, res) {
  return Frame.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Frame from the DB
export function show(req, res) {
  Frame.find({target: req.params.id}, (err, frames) => {
    if (err) {
      res.status(500).send(err);
    } else res.status(200).send(frames);
  });
  /*return Frame.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));*/
}

// Creates a new Frame in the DB
export function create(req, res) {
  console.log('create new frame');
  Image.findOne({_id: req.body.target}, (err, image) => {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log('found the related image');
      const length = image.frames.length;
      const newFrame = Object.assign({}, req.body, {rank: length});
      return Frame.create(req.body)
        .then((frame) => {
          console.log('new frame created, updating image list of frames');
          image.update({$addToSet: {frames: frame._id}}, (err, newImage) => {
            if (err) {
              res.status(500).send(err);
            }
            else  {
              console.log('updating frame list');
              // reget associated frames
              Frame.find({target: image._id}, (err, frames) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(201).send(frames);
                }
              });
            }
          })
        })
        .catch(handleError(res));
    }
  });
}

// Updates an existing Frame in the DB
export function update(req, res) {
  const imageId = req.params.id;
  console.log(req.body.map(frame => ({c:frame.color,r:frame.rank})));

  mapSeries(req.body, (frame, frameCb) => {
    console.log({c:frame.color,r:frame.rank});
    Frame.update({_id: frame._id}, {rank: frame.rank}, {}, frameCb)
  }, (err, results) => {
    console.log(results);
    Frame.find({target: imageId}, (err, frames) => {
      console.log(frames.map(frame => ({c:frame.color,r:frame.rank})));
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.status(200).json(frames);
      }
    });
  })
  // console.log(req.body);
  // res.status(201).json({msg: 'ok'})
  /*if (req.body._id) {
    delete req.body._id;
  }
  return Frame.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));*/
}

// Deletes a Frame from the DB
export function destroy(req, res) {
  console.log('delete a frame ', req.params.id);
  Frame.findById(req.params.id, (err, frame) => {
    if (!err) {
      const rank = frame.rank;
      console.log('fount the frame to delete at rank ', rank);
      Image.findOne({frames: req.params.id}, (err, image) => {
        if (err) {
          res.status(500).send(err);
        } else {
          console.log('found the related image');

          return Frame.remove({_id: req.params.id})
            .then((frame) => {
                  const condition = {
                    target: image._id,
                    rank: {'$gt': rank}
                  };
                  console.log('updating frames list that satisfy condtion', condition);
                  // update frames that have a greater rank
                  Frame.update(condition, {
                    $inc: {rank: -1}
                  }, {multi: true}, (err, changes) => {
                      console.log('errors: ', err);
                      console.log('changes: ', changes);
                      Frame.find({target: image._id}, (err, frames) => {
                        console.log('got new frames, updating image');
                        const list = frames.map(frame => frame._id);
                        image.update({$set : {frames: list}}, (err, newImage) => {
                          if (err) {
                            res.status(500).send(err);
                          }
                          else  {
                            res.status(200).send(frames);
                          }
                        });
                    });
                  })
            })
            .catch(handleError(res));
        }
      });
    } else res.status(500).send(err);
  })

}
