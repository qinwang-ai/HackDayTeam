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

*/
  var socket = io();
  socket.on('connection', function (data){
      console.log('connection success');
  });
  socket.on('play', function (data){
      console.log('[play]', data);
      start_game = 1;
  });

  socket.on('result', function (data){
     console.log('[result]', data);
     if( data[ 'name'] == 'A'){
         if( data[ 'flag']){
            statusA = 1;
            hit_Bitmap_A.visible = true;
            LTweenLite.to( hit_Bitmap_A, 0.5, {visible:false});
        }else{
            statusA = 0;
            miss_Bitmap_A.visible = true;
            LTweenLite.to( miss_Bitmap_A, 0.5, {visible:false});
        }
     }

     if( data[ 'name'] == 'B'){
         if( data[ 'flag']){
            statusB = 1;
            hit_Bitmap_B.visible = true;
            LTweenLite.to( hit_Bitmap_B, 0.5, {visible:false});
        }else{
            statusB = 0;
            miss_Bitmap_B.visible = true;
            LTweenLite.to( miss_Bitmap_B, 0.5, {visible:false});
        }
     }
  });

  socket.on('attack', function (data) {
      console.log('[attack]', data);
      if(data == 1){
          statusA = 2;
      }
      if(data == 2){
          statusB = 2;
      }
  });

  socket.on('stop', function (data) {
      console.log('[stop]', data);
      if( data == 'A'){
          statusA = 3;
      }
      if( data == 'B'){
          statusB = 3;
      }
  });
