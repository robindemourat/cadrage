'use strict';

angular.module('cadrageApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('image', {
        url: '/image/:id?',
        template: '<imageview flex="grow" layout="column"></imageview>'
      });
  });
