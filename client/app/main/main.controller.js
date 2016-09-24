'use strict';

(function() {

  class MainController {

    constructor($http, $scope) {
      this.$scope = $scope;
      this.$http = $http;
      this.awesomeThings = [];

      $scope.$on('dataUpdate', ()=>{
        this.$onInit();
      });
    }

    $onInit() {
      this.$http.get('/api/images/')
        .then(response => {
          this.images = response.data;
        });
    }

    addThing() {
      if (this.newThing) {
        this.$http.post('/api/things', {
          name: this.newThing
        });
        this.newThing = '';
      }
    }

    deleteThing(thing) {
      this.$http.delete('/api/things/' + thing._id);
    }
  }

  angular.module('cadrageApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController
    });
})();
