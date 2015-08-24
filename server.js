/*var http= require('http');
var server=http.createServer(function(request,response){
	response.write("Hello world!");
	response.end();
}).listen(1488,'127.0.0.1');
console.log('Server started!');*/
var count=0;
var express = require('express'),
app=express(),
server=require('http').createServer(app),
io=require('socket.io').listen(server);


function player(nickname)
{
	this.nickname=nickname;
	this.posX=50;
	this.posY=50;
	this.w=Math.floor(Math.random() * (75- 45 + 1)) + 45;
	this.h=Math.floor(Math.random() * (75- 45 + 1)) + 45;
	this.color=getRandomColor();
}
function getRandomColor() {
			    var letters = '0123456789ABCDEF'.split('');
			    var color = '#';
			    for (var i = 0; i < 6; i++ ) {
			        color += letters[Math.floor(Math.random() * 16)];
			    }
			    return color;
			}

var nicknames=[];
var players=[];



server.listen(8080,'192.168.1.3');
//server.listen(8080,'78.107.239.27');

app.get('/',function(req,res){
	res.sendfile(__dirname+"/index.html");
	//res.end();
});

io.sockets.on('connection',function(socket){

	socket.on('new user',function(data,callback){
		if(nicknames.indexOf(data) != -1){
			callback(false);
		}
		else {
			callback(true);
			socket.nickname=data;
			nicknames.push(socket.nickname);
			updateNicknames();
			var $onePlayer=new player(socket.nickname);
			players.push($onePlayer);
		}
	});

	socket.on('send message', function(data){
		io.sockets.emit('new message',{msg:data, nickname: socket.nickname});

	}) ;

	function updateNicknames(){
		io.sockets.emit('usernames',nicknames);
	}

	
	socket.on('disconnect',function(data){
		if(!socket.nickname) return;
		nicknames.splice(nicknames.indexOf(socket.nickname),1);
		updateNicknames();
	});

	socket.on('getPlayers',function(data){
		

		io.sockets.emit('send players',players);
	});

	socket.on('changepos',function(data){
		for(var i=0;i<players.length;i++)
		{
			if(players[i].nickname==socket.nickname)
			{
				switch(data)
				{
					case 87:
					 players[i].posY-=4;
					break;

					case 65:
					players[i].posX-=4;
					break;

					case 83:
					players[i].posY+=4;
					break;

					case 68:
					players[i].posX+=4;
					break;
				}
				//io.sockets.emit('send players',players);
			}
		}
	});

});

