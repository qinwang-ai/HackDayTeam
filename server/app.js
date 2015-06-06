'use strict';

var koa = require('koa.io');
var middlewares = require('koa-middlewares');
var routes = require('./routes');
var config = require('./config');
var path = require('path');
var leap = require('./leap');
var net = require('net');
var gestureRaw = require('../static/gesture.json');
var moment = require('moment');

var gesture = {
  A: [],
  B: []
};

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
var startTime;

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
    startTime = moment();
    app.io.emit('play', {});
  }
}, 10 * 1000);

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
var isOk = function (index) {
  //TODO根据现在的时间和gesture.json判断
  return true;
};
//返回超时未检测错误 每1秒检测一次
var startI = 0;
setTimeout(function () {
  for(var i = startI; i < gestureRaw.length; i++) {
    var deadline = moment(startTime).add(moment.duration(gestureRaw[i].time)).add(1, 'm');
    if(moment() > deadline) { //如果已经超时
      if(!gesture.A[i] && moment() > deadline) {
        gesture.A[i] = true;
        app.io.emit('result', {
          name: 'A',
          index: i,
          flag: false
        });
      }
      if(!gesture.B[i] && moment() > deadline) {
        gesture.B[i] = true;
        app.io.emit('result', {
          name: 'B',
          index: i,
          flag: false
        });
      }
    } else {
      startI = i;
      break;
    }
  }
}, 1000);

var server = net.createServer(function(sock) {
    // 我们获得一个连接 - 该连接自动关联一个socket对象
    console.log('CONNECTED: ' +
        sock.remoteAddress + ':' + sock.remotePort);
    // 为这个socket实例添加一个"data"事件处理函数
    sock.on('data', function(data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);

        var user = (data.split('_'))[0];
        var index = (data.split('_'))[1];
        if(isOk(index)) {
          gesture[user][index] = true;
          app.io.emit('result', {
            name: user,
            index: index,
            flag: true
          });
        }

        // 回发该数据，客户端将收到来自服务端的数据
        sock.write('You said "' + data + '"');
    });
    sock.on('error', function (data) {
      console.log('ERROR');
    });
    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function(data) {
        console.log('CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
    });
});
server.listen(config.socketport, '25.0.0.116');
console.log('The leap socket server is listening port %s.', config.socketport);