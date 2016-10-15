'use strict';

var express = require('express');
import {waterfall} from 'async';


import Image from '../image/image.model';

var router = express.Router();


function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

const compareProp = (prop, a, b)=>{
  if (a[prop] === undefined) {
    return 1;
  } else if (b[prop] === undefined) {
    return -1;
  }
  return b[prop] > a[prop];
};



/**
 * sort images according to the client table sorting rules in order to determine next images
 */
const sortImages = (inputImages, inputOrder) =>{
  const reverse = inputOrder.indexOf('-') === 0;
  const order = inputOrder.indexOf('-') === 0 ? inputOrder.substr(1) : inputOrder;
  console.log('order %s reverse %s', order, reverse);
  let images = inputImages.sort((a, b)=>{
    switch (order) {
      case 'fileName':
        return b.fileName > a.fileName;
      case 'numeroAtelier':
        return compareProp('numeroAtelier', a, b);
      case 'numeroTelerama':
        return compareProp('numeroTelerama', a, b);
      case 'typeArticle':
        return compareProp('typeArticle', a, b);
      case 'frames':
        return a.frames.length > b.frames.length;
      default:
        return 1;
    }
  });
  if (reverse) {
    images.reverse();
  }
  return images;
};

router.get('/:currentId', (req, res) => {
  const order = req.query.order || 'fileName';
  const id = req.params.currentId;
  let theDoc;
  Image.find()
    .exec()
    .then((inputImages) => {
      const images = sortImages(inputImages.map(
          input => Object.assign({}, input._doc, {_id: input._id})
        ), order);
      let currentIndex;

      images.some((image, imageIndex) => {
        if (image._id == id) {
          currentIndex = imageIndex;
          return true;
        }
        return false;
      });
      const nextIndex = (currentIndex < images.length - 2) ? currentIndex + 1 : 0;
      const previousIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
      return res.status(200).json({
        nextId: images[nextIndex]._id,
        previousId: images[previousIndex]._id
      });
    })
    .catch(handleError(res))
  /*waterfall([
    // find the current image
    (findCb) => {
      Image.find({_id: req.params.currentId}, findCb);
    },
    // check if other pages from the same atelier that have no frames
    // (theDocSel, neighborCb) => {
    //  theDoc = theDocSel[0];
    //  Image.find({
    //     numeroAtelier: theDoc.numeroAtelier,
    //     _id: { $ne: theDoc._id}
    //  }, neighborCb);
    // },
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
  });*/
});

module.exports = router;
