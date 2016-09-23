/**
 * Frame model events
 */

'use strict';

import {EventEmitter} from 'events';
import Frame from './frame.model';
var FrameEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
FrameEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Frame.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    FrameEvents.emit(event + ':' + doc._id, doc);
    FrameEvents.emit(event, doc);
  }
}

export default FrameEvents;
