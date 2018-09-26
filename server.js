const express=require('express');
const static=require('express-static');
const bodyParser=require('body-parser');
const consolidate=require('consolidate');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const expressRoute=require('express-route');
const multer=require('multer');
const mysql=require('mysql');
const moment = require('moment');


/*
var s1 = moment().format("YYYY-MM-DD HH:mm:ss");
var s2 = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
var s3 = moment("2016/04/01", "YYYY/MM/DD").format("YYYY-MM-DD");

console.log("s1=" + s1);
console.log("s2=" + s2);
console.log("s3=" + s3);*/



var server=express();
server.listen(8888);


server.use(bodyParser.urlencoded());
server.use(multer({dest:'./asset/upload'}).any());

server.use(cookieParser());
(function(){
	var keys=[];
	for(var i=0;i<100000;i++){
		keys[i]='abc_'+Math.random();
	}
	server.use(cookieSession({
		name: 'sess_id',
		keys: keys,
		maxAge: 3600*1000
	}));
})();

server.engine('html', consolidate.ejs);
server.set('views', 'template');
server.set('view engine','html');

server.use('/wenlinqing/', require('./route/index')())
server.use('/wenlinqing/add', require('./route/index/add')())
server.use('/wenlinqing/admin/', require('./route/admin')())

// server.use(static('./asset/')) // /asset/images/xxx.png
server.use('/asset/',static('./asset/')) // /asset/images/xxx.png
//admin wlq@wlq@123
//common 123456
