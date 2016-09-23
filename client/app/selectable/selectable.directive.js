'use strict';

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

angular.module('cadrageApp')
  .directive('selectable', function () {
    return {
      restrict: 'A',
      scope: {
        frames: '=',
        addFrame: '&',
        deleteFrame: '&'
      },
      link: function (scope, element, attrs) {

        let frames = [];
        const parent = element.parent();
        let tempRect;
        let draggedRect;
        let tempRectPos;
        let position;
        let clicking = false;
        let imageReady;
        let updatePending;

        const updateMousePosition = (event) => ({
          offsetX: event.offsetX,
          offsetY: event.offsetY,
          x: event.offsetX / element.width(),
          y: event.offsetY / element.height(),

          elementWidth: element.width(),
          elementHeight: element.height(),
          elementOffsetX: element.offset().left,
          elementOffsetY: element.offset().top
        });

        const frameId = (arg) => {
          // frame to id
          if (typeof arg === 'object') {
            return  ('frame-' + arg.x + '-' + arg.y).replace(/\./g, '');
          // id to frame
          }
          return frames.find((frame) =>
              ('frame-' + frame.x + '-' + frame.y).replace(/\./g, '') === arg
            );
        };

        const addFrame = (frame, temp) =>{
          const frameElement = angular.element('<div class="frame-rect"></div>');
          const params = {
            left: position.elementOffsetX + frame.x * position.elementWidth,
            top: position.elementOffsetY + frame.y * position.elementHeight,
            width:  position.elementWidth * frame.w,
            height: position.elementHeight * frame.h,
            background: !temp ? frame.color : 'transparent',
            border: !temp ? 'none' : '.5rem solid ' + frame.color
          };
          frameElement.css(params);
          const id = frameId(frame);
          frameElement.attr('id', id);
          if (frame.rank !== undefined) {
            const span = angular.element('<span class="frame-rank"></span>').text(frame.rank+1);
            frameElement.append(span);
          }
          const close = angular.element('<span class="frame-delete">x</span>');
          close.on('mouseup', function(){
                scope.deleteFrame({frame: frame});
                frameElement.remove();
          });
          frameElement.append(close);
          parent.append(frameElement);
          return frameElement;
        };

        const onResize = () => {
          const width = element.width();
          const height = element.height();
          const elementOffsetX = element.offset().left;
          const elementOffsetY = element.offset().top;
          frames.forEach(frame => {
             const frameElement = parent.find('#' + frameId(frame));
             frameElement.css({
              left: elementOffsetX + frame.x * width,
              top: elementOffsetY + frame.y * height,
              width:  width * frame.w,
              height: height * frame.h
            });
          });
        };

        const onMouseDown = (e) => {
          if (!clicking) {
            clicking = true;
            position = updateMousePosition(e);
            // check if on an existing frame
            tempRectPos = {x: position.x, y: position.y};
            tempRect = addFrame({
              x: tempRectPos.x,
              y: tempRectPos.y,
              w: 0.01,
              h: 0.01,
              color: 'brown'
            }, true);
            tempRect.addClass('dimensionning temp');
          }
        };

        const onMouseMove = (e) => {
          if (clicking) {
            position = updateMousePosition(e);
            if (position.x > tempRectPos.x &&
                position.y > tempRectPos.y) {
              tempRect.css({
                width: (position.x - tempRectPos.x) * position.elementWidth,
                height: (position.y - tempRectPos.y) * position.elementHeight
              });
            }
          }
        };

        const onMouseUp = (e) => {
          if (clicking) {
            position = updateMousePosition(e);
            if (position.x - tempRectPos.x > 0.05 &&
                position.y - tempRectPos.y > 0.05) {
              const newFrame = {
                x: tempRectPos.x,
                y: tempRectPos.y,
                w: position.x - tempRectPos.x,
                h: position.y - tempRectPos.y,
                color: getRandomColor()
              };
              scope.addFrame({frame: newFrame});
              const frameElement = addFrame(newFrame);
              frames.push(newFrame);
            }
          }
          // security
          if (tempRect) {
            tempRect.remove();
            tempRect = undefined;
          }
          clicking = false;
        };

        const onFrameUpdate = (topFrames) => {
          if (topFrames && topFrames.length) {
            if (imageReady) {
            parent.find('.frame-rect').remove();
              if (position === undefined) {
                position = {
                  elementWidth: element.width(),
                  elementHeight: element.height(),
                  elementOffsetX: element.offset().left,
                  elementOffsetY: element.offset().top
                };
              }
              frames = topFrames.slice();
              topFrames.forEach((input, inputIndex) => {
                const frameElement = addFrame(input);
              });
            } else updatePending = true;
          }
        };

        element.on('mousedown', onMouseDown);
        element.on('mouseup', onMouseUp);
        element.on('mousemove', onMouseMove);

        scope.$watch(() => {
          return {
            width: element.width(),
            height: element.height()
          }
        }, onResize, true);

        angular.element(window).on('resize', onResize);

        element.bind('load', function() {
          imageReady = true;
          if (updatePending) {
            onFrameUpdate(scope.frames);
          }
        });

        scope.$watch('frames', onFrameUpdate);

        scope.$on('destroy', ()=>{
          element.off('mousedown', onMouseDown);
          element.off('mouseup', onMouseUp);
          element.off('mousemove', onMouseMove);
          angular.element(window).off('resize', onResize);
        });
      }
    };
  });
