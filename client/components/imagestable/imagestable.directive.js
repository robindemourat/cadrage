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

        scope.filter = {
          search: ''
        };

        scope.query = {
          limit: 5,
          page: 1,
          order: 'fileName'
        };
        scope.limitOptions = [5, 10, 15, 20, 50, 100, 500];

        scope.$watch('images', function(images) {
          if (images !== undefined) {
            scope.imagesDisplay = images.sort((a, b)=> {
              return a.fileName > b.fileName;
            });
          }
        });

        scope.goToImage = (id) => {
          const path = ('/image/' + id);
          $location.path(path);
          $location.search('order', scope.query.order);
        };
      }
    };
  });
