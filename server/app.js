'use strict';

var koa = require('koa.io');
var middlewares = require('koa-middlewares');
var routes = require('./routes');
var config = require('./config');
var path = require('path');
var net = require('net');
var gestureRaw = require('./static/gesture.json');
var moment = require('moment');

var gesture, combo, hp, startI;

var reset = function () {
  startI = 0;
  gesture = {
    A: [],
    B: []
  };
  combo = {
    A: 0,
    B: 0
  };
  hp = {
    A: 10,
    B: 10
  };
};

reset();

var app = koa();
app.keys = config.keys;

//http头中包含处理时间
app.use(middlewares.rt());

// use cookie session
app.use(middlewares.cookieSession(app));
// body parser
app.use(middlewares.bodyparser());

// 如果游戏已经开始，则禁止进入游戏
app.use(function* (next) {
  if(isStart) {
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
  if(num === 0) {
    isStart = false;
    reset();
  }
});


// websocket
// setTimeout(function () {
//   console.log('check start condition: isStart:%s num:%s', isStart, num);
//   if(!isStart && num > 0) {
//     console.log('websocket: [send] play');
//     isStart = true;
//     startTime = moment();
//     app.io.emit('play', {});
//   }
// }, 20 * 1000);

// var aaatmp = 0;
// var t = setInterval(function () {
//   if(isStart && num > 0) {
//     console.log('websocket: [send] result');
//     app.io.emit('result', {
//       name:  'A',
//       index: aaatmp++,
//       flag: true
//     });
//   }
// }, 3000);

// leap socket
var isOk = function (user, index) {
  //TODO根据现在的时间和gesture.json判断
  for(var i = 0; i < gestureRaw.length; i++) {
    var elem = gestureRaw[i];
    if(!!gesture[user][index]) {
      continue;
    }
    var tmpTime1 = moment(startTime).add(moment.duration(gestureRaw[i].time)).add(0.5, 's');
    var tmpTime2 = moment(startTime).add(moment.duration(gestureRaw[i].time)).subtract(0.5, 's');
    var now = moment();
    if(tmpTime1 <= now && now <= tmpTime2) {
      return true;
    }
  }
  return false;
};
//返回超时未检测错误 每1秒检测一次
setTimeout(function () {
  for(var i = startI; i < gestureRaw.length; i++) {
    var deadline = moment(startTime).add(moment.duration(gestureRaw[i].time)).add(1, 's');
    if(moment() > deadline) { //如果已经超时
      if(!gesture.A[i] && moment() > deadline) {
        gesture.A[i] = true;
        console.log('websocket: [send] result %s %s %s', 'A', i, false);
        app.io.emit('result', {
          name: 'A',
          index: i,
          flag: false
        });
        combo.A = 0;
      }
      if(!gesture.B[i] && moment() > deadline) {
        gesture.B[i] = true;
        console.log('websocket: [send] result %s %s %s', 'B', i, false);
        app.io.emit('result', {
          name: 'B',
          index: i,
          flag: false
        });
        combo.B = 0;
      }
    } else {
      startI = i;
      break;
    }
  }
}, 1000);

var socketServer = net.createServer(function(sock) {
    // 我们获得一个连接 - 该连接自动关联一个socket对象
    console.log('CONNECTED: ' +
        sock.remoteAddress + ':' + sock.remotePort);

    sock.on('error', function(err){
    // Handle the connection error.
      sock.close();
    });

    // 为这个socket实例添加一个"data"事件处理函数
    sock.on('data', function(data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);

        data = data.toString();
        if(!data) {
          return;
        }
        if(data === 'start') {
          if(!isStart && num > 0) {
            console.log('websocket: [send] play');
            isStart = true;
            startTime = moment();
            app.io.emit('play', {});
          }
          sock.write('You said "' + data + '"');
          return;
        }
        var user = (data.split('_'))[0];
        var index = (data.split('_'))[1];
        if(isOk(user, index)) {
          gesture[user][index] = true;
          console.log('websocket: [send] result %s %s %s', user, index, true);
          app.io.emit('result', {
            name: user,
            index: index,
            flag: true
          });
          combo[user]++;
          //触发攻击
          if(combo[user] === config.comboNum) {
            setTimeout(function () {
              if(combo.A >= 10 && combo.B < 10) {
                hp.B--;
                app.io.emit('attack', 1);
                console.log('websocket: [send] attack 1');
                if(!hp.B) {
                  app.io.emit('stop', 'A');
                  reset();
                }
              } else if(combo.A < 10 && combo.B >= 10) {
                hp.A--;
                app.io.emit('attack', 2);
                console.log('websocket: [send] attack 2');
                if(!hp.A) {
                  app.io.emit('stop', 'B');
                  reset();
                }
              } else if(combo.A >=10 && combo.B >= 10) {
                app.io.emit('attack', 0);
                console.log('websocket: [send] attack 0');
              }
            }, 1000);
          }
        }

        // 回发该数据，客户端将收到来自服务端的数据
        sock.write('You said "' + data + '"');
    });
    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function(data) {
        console.log('CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
    });
});
socketServer.listen(config.socketport, '192.168.60.27');
console.log('The leap socket server is listening port %s.', config.socketport);

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    console.log(err.stack);
});