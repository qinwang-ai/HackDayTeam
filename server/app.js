'use strict';

var koa = require('koa.io');
var middlewares = require('koa-middlewares');
var routes = require('./routes');
var config = require('./config');
var path = require('path');
var leap = require('./leap');

var app = koa();
app.keys = config.keys;

//http头中包含处理时间
app.use(middlewares.rt());

// use cookie session
app.use(middlewares.cookieSession(app));
// body parser
app.use(middlewares.bodyparser());

// 如果游戏已经开始，则禁止进入游戏
var isPlay = false;
app.use(function* (next) {
  if(isPlay) {
    this.body = '游戏已开始';
    this.type = 'html';
  } else {
    yield* next;
  }
});

// static cache
app.use(middlewares.staticCache({
  dir: path.join(__dirname, 'static'),
  buffer: true,
  gzip: true
}));

// routes
app.use(middlewares.router(app));
routes(app);

app.listen(config.webport);
console.log('The server is listening port %s.', config.webport);

// websocket
app.io.use(function* (next) {
  console.log('New audience connects.');

  // web socket test
  setTimeout(function () {
    console.log('websocket: [send] play');
    this.broadcast.emit('play');
  }, 1000);
  var tmp = 0;
  var t = setInterval(function () {
    console.log('websocket: [send] result')
    this.broadcast.emit('result', {
      name:  'A',
      index: tmp++,
      flag: true
    });
  }, 5000);

  setTimeout(function () {
    clearInterval(t);
    this.broadcast.emit('stop', 'A');
  }, 30 * 1000);

  yield* next;
  console.log('Some audience disconnects.');
});

// 游戏开始，所有连接者同时开始
app.io.route('play', function* (next) {
  isPlay = true;
  this.broadcast.emit('play');
});


// leap socket
leap.listen(config.socketport, '25.0.0.116');
console.log('The leap socket server is listening port %s.', config.socketport);