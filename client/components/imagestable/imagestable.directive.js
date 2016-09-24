'use strict';

angular.module('cadrageApp')
  .directive('imagestable', function ($location) {
    return {
      templateUrl: 'components/imagestable/imagestable.html',
      restrict: 'EA',
      scope: {
        images: '='
      },
      link: function (scope) {
        scope.query = {
          order: 'fileName',
          limit: 5,
          page: 1
        };

        const compareProp = (prop, a, b)=>{
          if (a[prop] === undefined) {
                  return 1;
                } else if (b[prop] === undefined) {
                  return -1;
                }
                return b[prop] > a[prop];
        };

        scope.reorderImages = (inputOrder) =>{
          const reverse = inputOrder.indexOf('-') === 0;
          const order = inputOrder.indexOf('-') === 0 ? inputOrder.substr(1) : inputOrder;
          console.log('order %s reverse %s', order, reverse);
          scope.imagesDisplay = scope.imagesDisplay.sort((a, b)=>{
            switch (order) {
              case 'Fichier':
                return b.fileName > a.fileName;
              case 'Atelier':
                return compareProp('numeroAtelier', a, b);
              case 'Telerama':
                return compareProp('numeroTelerama', a, b);
              case 'Type':
                return compareProp('typeArticle', a, b);
              case 'frames':
                return a.frames.length > b.frames.length;
              default:
                return 1;
            }
          });
          if (reverse) {
            scope.imagesDisplay.reverse();
          }
        };

        scope.$watch('images', function(images) {
          if (images !== undefined) {
            scope.imagesDisplay = images.sort((a, b)=> {
              return a.fileName > b.fileName;
            });
          }
        });

        scope.goToImage = (id) => {
          $location.path('/image/' + id);
        };
      }
    };
  });
