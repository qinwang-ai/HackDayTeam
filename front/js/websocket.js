/*
var ws=new WebSocket("ws://localhost:8080");
$(function(){
    ws.onopen = function(){
        alert("连接成功");
    }
    ws.onerror = function(){
        alert("连接失败");
    }
	ws.onmessage = function(e){
		alert( e.data);
	};
});

//ws.send( $('.textarea').val());


if(!window.WebSocket && window.MozWebSocket)
     window.WebSocket=window.MozWebSocket;
if(!window.WebSocket){
    alert("此浏览器不支持WebSocket");
}

  var socket = io('http://hackday.com/');
  socket.on('play', function (data) {
     console.log(data);
    sockets.emit('result', 'A', 0, true);
  });

  socket.on('result', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });

  socket.on('attack', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });

  socket.on('stop', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });

*/
