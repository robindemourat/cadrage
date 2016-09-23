'use strict';


(function(){

class ImageComponent {
  constructor($http, $stateParams) {
    this.imageId = $stateParams.id;
    this.$http = $http;
    this.nextImageId = '';
    this.display = {
      drawerOut: false
    };
    this.frames = [];
    this.sortableOptions = {
      'ui-floating': true,
      axis: 'x',
      stop: (e, ui) => {
        const newFrames = this.frames.map((frame, i) => {
          return Object.assign({}, frame, {rank: i});
        });

        this.$http
        // get all frames for current image
        .patch('/api/frames/' + this.imageId, newFrames)
        .then(response => {
          if (response.status === 200) {
            this.frames = response.data.sort((frameA, frameB) => frameB.rank < frameA.rank);
            this.updateImageFrames();
          }
        });
      }
    };
  }

  updateDisplayVal (image) {
    this.imageDisplayVals = [
      {
        key: 'Nom fichier',
        value: image.fileName || 'Inconnu'
      },{
        key: 'Numéro atelier',
        value: image.numeroAtelier || 'Inconnu'
      },
      {
        key: 'Type',
        value: image.typeArticle || 'Inconnu'
      },
      {
        key: 'Numéro télérama',
        value: image.numeroTelerama || 'Inconnu'
      },
      {
        key: 'Numéro scan',
        value: image.numeroScan || 'Inconnu'
      }
    ];
  }

  $onInit () {
    this.$http
      .get('/api/images/' + this.imageId)
      .then(response => {
        this.image = response.data;
        this.updateDisplayVal(this.image);
        this.$http
          // get all frames for current image
          .get('/api/frames/' + this.imageId)
          .then(response => {
            if (response.status === 200) {
              this.frames = response.data.sort((frameA, frameB) => frameB.rank < frameA.rank);
              this.updateImageFrames();
            }
          });
        this.$http
          .get('/api/nextimage/' + this.imageId)
          .then(response => {
            if (response.status === 200) {
              this.nextImageId = response.data;
            }
          })
      });
  }

  updateImageFrames () {
    if (this.image) {
      this.image.frames = this.frames.map(frame => frame._id);
    }
  }

  addFrame (frame) {
    this.$http
      .post('/api/frames/', Object.assign({}, frame, {
        target: this.imageId,
        rank: this.image.frames.length
      }))
      .then(response => {
        if (response.status === 201) {
          this.frames = response.data.sort((frameA, frameB) => frameB.rank < frameA.rank);
          this.updateImageFrames();
        } else console.log('error: ', response);
      })
  }

  deleteFrame (frame) {
    this.$http
      .delete('/api/frames/' + frame._id)
      .then(response => {
        if (response.status === 200) {
          this.frames = response.data.sort((frameA, frameB) => frameB.rank < frameA.rank);
          this.updateImageFrames();
        } else console.log('error: ', response);
      })
  }

  toggleDrawer () {
    this.display.drawerOut = !this.display.drawerOut;
  }
}

angular.module('cadrageApp')
  .component('imageview', {
    templateUrl: 'app/image/image.html',
    controller: ImageComponent,
    controllerAs: 'imageCtrl'
  });

})();
