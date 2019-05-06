const express=require('express');
const mysql=require('mysql');
const fs=require('fs');
const urlLib=require('url');
const common=require('../../libs/common');

const DBS=require('../../libs/db');
var db=DBS.db;

module.exports=function(){
	var router=express.Router();
	router.get('/',(req,res)=>{
		res.redirect('/mobile/index');
	});
	router.get('/index', (req,res)=>{
		db.query('SELECT * FROM telbook ORDER BY datetime ASC',(err,data)=>{
			if (err) {
				console.log(err);
				res.status(500).send('dabase error').end();
			}else {
				res.render('index.ejs',{dataList: data,user:req.session['sessionTag'], moment: require("moment") });// 登入时记录的 sessionTag
			}
		})
	});


	// router.use('/add',require('./add')());


	return router;
}




