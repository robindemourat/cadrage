'use strict';

var express = require('express');
import {waterfall} from 'async';


import Image from '../image/image.model';

var router = express.Router();

router.get('/:currentId', (req, res) => {
  let theDoc;
  waterfall([
    // find the current doc
    (findCb) => {
      Image.find({_id: req.params.currentId}, findCb);
    },/*
    // check if other pages from the same atelier that have no frames
    (theDocSel, neighborCb) => {
     theDoc = theDocSel[0];
     Image.find({
        numeroAtelier: theDoc.numeroAtelier,
        _id: { $ne: theDoc._id}
     }, neighborCb);
    },*/
    // else pick a random not processed image
    (matches, randomCb) => {
      theDoc = matches[0];
      // if (matches.length) {
      //   randomCb(null, matches);
      // } else {
        Image.find({
            _id: { $ne: theDoc._id}
         }, randomCb);
      // }
    }
  ], (err, winners) => {
    if (err) {
      res.status(500).send(err);
    } else if (winners.length) {
      const index = parseInt(Math.random() * (winners.length - 1));
     res.status(200).send(winners[index]._id);
    } else res.status(404).send([]);
  });
});

module.exports = router;
