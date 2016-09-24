'use strict';

class NavbarController {
  constructor($http, $mdToast, $rootScope) {
    this.$rootScope = $rootScope;
    this.$http = $http;
    this.isSyncing = false;
    this.isPreparing = false;
    this.$mdToast = $mdToast;
    this.last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    this.toastPosition = angular.extend({}, this.last);
  }

  sanitizePosition() {
    var current = this.toastPosition;

    if ( current.bottom && this.last.top ) {
      current.top = false;
    }
    if ( current.top && this.last.bottom ) {
      current.bottom = false;
    }
    if ( current.right && this.last.left ) {
      current.left = false;
    }
    if ( current.left && this.last.right ) {
      current.right = false;
    }

    this.last = angular.extend({}, current);
  }

  getToastPosition() {
    this.sanitizePosition();
    return Object.keys(this.toastPosition)
        .filter((pos) => { return this.toastPosition[pos]; })
        .join(' ');
  }

  displayToast(text) {
    const pinTo = this.getToastPosition();
    this.$mdToast.show(
      this.$mdToast.simple()
        .textContent(text)
        .position(pinTo )
        .hideDelay(5000)
    );
  }

  downloadData() {
    if (this.isPreparing === false) {
      this.displayToast('Préparation des données');
      this.isPreparing = true;
      this.$http
        .get('/api/images/?csv')
        .then(response => {
          this.isPreparing = false;
          if (response.status === 200) {
            this.displayToast('Téléchargement lancé');
             const anchor = angular.element('<a/>');
             anchor.attr({
                     href: 'data:attachment/csv;charset=utf-8,' + encodeURI(response.data),
                     target: '_blank',
                     download: 'donnees_images_cadres.csv'
              })[0].click();
          } else {
            this.displayToast('Échec lors de la préparation des données ...');
          }
        });
    } else {
      this.displayToast('Déjà en train de préparer le téléchargement, patience !');
    }
  }

  syncImages() {
    if (this.isSyncing === false) {
      this.displayToast('Début de la synchronisation');
      this.isSyncing = true;
      this.$http
      .get('/api/imageoperations/update')
      .then(response => {
        this.isSyncing = false;

        if (response.status === 200) {
          this.displayToast('Synchronisation réussie !');
          this.$rootScope.$broadcast('dataUpdate');
        } else {
          this.displayToast('Synchronisation échouée ...');
        }
      });
    } else {
      this.displayToast('Déjà en train de synchroniser, patience !');
    }

  }
}

angular.module('cadrageApp')
  .controller('NavbarController', NavbarController);
