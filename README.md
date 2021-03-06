Cadrage - an app for defining zones of interest in a series of pictures
---

![Screencast](https://github.com/robindemourat/cadrage/blob/master/screencast-cadrage.gif?raw=true)

This is a web app dedicated to a simple task : defining and ordering specific zones of interest inside a series of images. Data concerning frames is stored in a mongodb, images on a s3 bucket.

Stack --> mongodb + node + angular

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node ^4.2.3, npm ^2.14.7
- [Bower](bower.io) (`npm install --global bower`)
- [Ruby](https://www.ruby-lang.org) and then `gem install sass`
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. Run `npm install` to install server dependencies.

2. Run `bower install` to install front-end dependencies.

3. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running

4. Run `gulp serve` to start the development server. It should automatically open the client in your browser when ready.

### Note on S3

Somehow frankfurt region should not be used for the s3 storing of the images.
