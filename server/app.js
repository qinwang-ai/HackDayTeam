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
  gzip: true,
  alias: {
    '/': '/index.html'
  }
}));

// routes
app.use(middlewares.router(app));
routes(app);

app.listen(config.webport);
console.log('The server is listening port %s.', config.webport);

var num = 0;
var isStart = false;

app.io.use(function* (next) {
  num++;
  console.log('New audience connects.');
  console.log('%s audiences are in the game room.', num);
  yield* next;
  num--;
  console.log('Some audience disconnects.');
  if(num === 0) {}
});


// websocket
setTimeout(function () {
  if(!isStart && num > 0) {
    console.log('websocket: [send] play');
    isStart = true;
    app.io.emit('play', {});
  }
}, 20 * 1000);

var tmp = 0;
var t = setInterval(function () {
  if(isStart && num > 0) {
    console.log('websocket: [send] result');
    app.io.emit('result', {
      name:  'A',
      index: tmp++,
      flag: true
    });
  }
}, 3000);

// leap socket
leap.listen(config.socketport, '25.0.0.116');
console.log('The leap socket server is listening port %s.', config.socketport);