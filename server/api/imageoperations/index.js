'use strict';

var express = require('express');
var controller = require('./imageoperations.controller');

var router = express.Router();

// returns the s3 images folder content
router.get('/get', controller.index);
// updates db from s3
router.get('/update', controller.update);

module.exports = router;
