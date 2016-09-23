'use strict';

import mongoose from 'mongoose';
import Image from '../image/image.model.js';

const FrameSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  w: Number,
  h: Number,
  isImage: Boolean,
  rank: Number,
  color: String,
  target: {type: mongoose.Schema.Types.ObjectId, ref: 'Image'}
});

export default mongoose.model('Frame', FrameSchema);
