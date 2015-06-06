'use strict';

module.exports = function (app) {
  app.get('/', function* () {
    yield this.render('index.html');
  });
};