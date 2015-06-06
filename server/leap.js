'use strict';

var net = require('net');
var tcp =require("tcp.io");

var server = new tcp.server();

server.on(function(c){
  c.on("ping", function(data){
    console.log("Server Count Request:%s",data.count);
    data.count++;
    data.message +=data.count
    c.emit("pong",data)
    })
});

module.exports = server;

server