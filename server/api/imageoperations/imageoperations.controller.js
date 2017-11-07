'use strict';
import { mapSeries, waterfall, ensureAsync } from 'async';
import _ from 'lodash';

import s3Client, {Bucket, ServerRegion} from '../../helpers/s3Client';
import {getPublicUrl} from 's3';
import parseFileName from '../../helpers/imageNameParser';
import Image from '../image/image.model.js';

// Returns the Bucket's images
export function index(req, res) {
  const params = {
    s3Params: {Bucket}
  };
  let images;
  console.log('listing files with params', params);
  // list objects
  s3Client.listObjects(params)
  .on('data', (data)=>{
    if (data.Contents) {
      images = data.Contents.filter((object)=>{
        const key = object.Key;
        return key.indexOf('images/') === 0 && key.length > 'images/'.length
      });
    }
  })
  .on('end', () => {
    if (images) {
      res.status(200).send(images);
    }
  })
  .on('error', e => {
    console.log('error', e);
    res.status(500).send({msg: 'problem', error: e})
  })
}

// Updates mongo db with s3 stored images
export function update(req, res) {
  const params = {
    s3Params: {Bucket}
  };
  let images;
  let err;
  console.log('listing files with params', params);
  // list objects
  s3Client
  .listObjects(params)
  .on('data', (data)=>{
    console.log('got data', data);
    if (data.Contents) {
      images = data.Contents.filter((object)=>{
        const key = object.Key;
        return key.indexOf('images/') === 0 && key.length > 'images/'.length
      });
    }
  })
  .on('error', (error) => {
    console.log('error', error);
    err = error;
  })
  .on('end', () => {
    if (images) {
      console.log('got images, begining to update db');
      waterfall([
        // update images with s3 images data
        (addingCb) => {
          console.log('begining to add new item and update images data');
          mapSeries(images, ensureAsync((imageData, imageCallback) => {

            console.log('updating db with ', imageData.Key);
            const image = Object.assign({}, imageData, parseFileName(imageData.Key));
            image.imageUrl = getPublicUrl(Bucket, imageData.Key, ServerRegion);
            Image.update({
              fileName: image.fileName
            }, {
              $set: image
            }, {
              upsert: true
            }, imageCallback);
          }), addingCb);
        },
        // clean s3-absent images
        (res, cleaningCb) => {
          console.log('begining cleaning removed images');
          Image.find({}, (err, imagesDb) => {
            console.log('got db images, comparing with s3');
            if (err) {
              res.status(500).send(err);
            } else {
              mapSeries(imagesDb, ensureAsync((imageDb, imageDbCallback) =>{
                console.log('checking ', imageDb.Key);
                const inS3 = images.find((imageS3) => imageS3.Key === imageDb.Key);
                if (inS3) {
                  imageDbCallback(null, imageDb);
                // no corresponding in key
                } else {
                  Image.remove({Key: imageDb.Key}, imageDbCallback);
                }
              }), cleaningCb);
            }
          });
        },
        // get updated images
        (res, getCb) => {
          console.log('getting updated images data');
          Image.find({}, getCb);
        }
      ], (err, data)=>{
        console.log('done updating');
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else res.status(200).send(data);
      });
    } else {
      res.status(500).send(err);
    }
  });
}
