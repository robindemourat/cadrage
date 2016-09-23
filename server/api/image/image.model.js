'use strict';

import mongoose from 'mongoose';

var ImageSchema = new mongoose.Schema({
  fileName: String,
  imageUrl: String,
  numeroAtelier: Number,
  numeroTelerama: Number,
  numeroScan: Number,
  typeArticle: String,
  Key: String,
  LastModified: Date,
  ETag: String,
  Size: Number,
  frames: [{type: mongoose.Schema.Types.ObjectId, ref: 'Frame'}]
});

export default mongoose.model('Image', ImageSchema);
