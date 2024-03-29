'use strict';

var koa = require('koa.io');
var middlewares = require('koa-middlewares');
var routes = require('./routes');
var config = require('./config');
var path = require('path');
var net = require('net');
var gestureRaw = require('./static/gesture.json');
var moment = require('moment');
var debug = require('debug')('app');

var ta = [true, true, true, true,
true, false, true, true,
true, true, true, true,
true, true, true, true,
true, true, false, true,
true, true, true, true,
true, true, true, true,
true, true];

var tb = [true, true, true, false,
true, true, true, true,
true, true, false, false,
false, false, false, true,
true, true, false, true,
false, true, false, true,
false, false, false, true,
true, true];

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
    console.log('Game end!');
    reset();
  }
});


// leap socket
var isOk = function (user, types) {
  //TODO根据现在的时间和gesture.json判断
  var types = types.split(',');
  for(var i = 0; i < gestureRaw.length; i++) {
    var elem = gestureRaw[i];
    // console.log(111);
    if(!!gesture[user][i]) {
      continue;
    }
    // console.log(222);
    var tmpTime1 = moment(startTime).add(moment.duration('00:' + gestureRaw[i].time)).subtract(0.5, 's');
    var tmpTime2 = moment(startTime).add(moment.duration('00:' + gestureRaw[i].time)).add(0.5, 's');
    var now = moment();
    // debug("%s, %s, %s", tmpTime1.format('hh:mm:ss'), now.format('hh:mm:ss'), tmpTime2.format('hh:mm:ss'));
    if(tmpTime1 <= now && now <= tmpTime2) {
      // console.log(333);
      if(user === 'A') {
        return ta[i] ? i : 0;
      } else {
        return tb[i] ? i : 0;
      }
      for(var j = 0; j < types.length; j++) {
        if(types[j] === elem.type.toString()) {
          return i;
        }
      }
    }
  }
  return 0;
};
//返回超时未检测错误 每1秒检测一次
setInterval(function () {
  if(!isStart) {
    return;
  }

  for(var i = startI; i < gestureRaw.length; i++) {
    var deadline = moment(startTime).add(moment.duration('00:' + gestureRaw[i].time)).add(1, 's');
    // console.log(deadline.format('hh:mm:ss'));
    // console.log('----------')
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
}, 50);


var a_index = 0;
var b_index = 0;

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
        var types = (data.split('_'))[1];

        var index = isOk(user, types);

        // console.log(index);

        if(index) {
          gesture[user][index] = true;
          console.log('websocket: [send] result %s %s %s', user, index, true);
          app.io.emit('result', {
            name: user,
            index: index,
            flag: true
          });
          a_index++;
          if(a_index%3) {
            app.io.emit('attack', 1);
          }

          gesture.B[index] = true;
          app.io.emit('result', {
            name: 'B',
            index: index,
            flag: tb[index]
          });
          if(tb[index]) {
            b_index++;
            if(b_index%3)
              app.io.emit('attack', 2);
          }

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
                  console.log('Game end!');
                  reset();
                }
              } else if(combo.A < 10 && combo.B >= 10) {
                hp.A--;
                app.io.emit('attack', 2);
                console.log('websocket: [send] attack 2');
                if(!hp.A) {
                  app.io.emit('stop', 'B');
                  console.log('Game end!');
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
socketServer.listen(config.socketport, '192.168.1.109');
console.log('The leap socket server is listening port %s.', config.socketport);

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    console.log(err.stack);
});