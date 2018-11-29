var socket = require('ws'),
	WebSocketServer = socket.Server;

wss = new WebSocketServer({ server: httpsServer });

//广播
function onSend(message){
	wss.clients.forEach(function(client) {
	    client.send(message);
    });
}

//用户接入
wss.on('connection', function (ws,req) {
	//用户发送消息
	ws.on('message', function (message) {
		
	})
})

//用户关闭socket
ws.on("close",function(){
	
})
//用户socket出错断开
ws.on("error",function(){
	
})