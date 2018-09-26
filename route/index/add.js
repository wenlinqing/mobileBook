const express=require('express');
const common=require('../../libs/common');
const mysql=require('mysql');
const pathLib=require('path');
const fs=require('fs');
const moment=require('moment')


const DBS=require('../../libs/db');
var db=DBS.db;

module.exports=function (){
  var router=express.Router();

  router.get('/',(req,res)=>{
    res.render('add_people.ejs',{title:'添加人员', info:'', action: req.query.act, user:req.session['sessionTag'] });
  });

  router.post('/',(req,res)=>{
    var username=req.body.username;
    var tel=req.body.tel;

    var pwd=req.body.password!=''?req.body.password:'123456';
    var password=common.md5(pwd+common.MD5_SUFFIX)

    var newFileName='';
    if (req.files[0]) {
      var ext=pathLib.parse(req.files[0].originalname).ext;
      var oldPath=req.files[0].path;
      var newPath=req.files[0].path+ext;
      newFileName=req.files[0].filename+ext;
    }
    if (newFileName) {// 有图片
      fs.rename(oldPath,newPath,(err)=>{
        if(err){
          res.status(500).send('images error').end()
        }else{
          var date=moment().format("YYYY-MM-DD HH:mm:ss");
          db.query(`INSERT INTO telBook (username,password,tel,imgSrc,modtime,datetime) \
          VALUES('${username}','${password}','${tel}','${newFileName}','${date}','${date}')`,(err,data)=>{
            if(err){
              console.log(err)
              res.status(500).send('db error').end()
            }else{
              res.redirect('/wenlinqing/index')
            }
          })
        }
      });
    }else{ // 没上传图片
      var date=moment().format("YYYY-MM-DD HH:mm:ss");
        db.query(`INSERT INTO telBook (username,password,tel,imgSrc,modtime,datetime) \
        VALUES('${username}','${password}','${tel}','${newFileName}','${date}','${date}')`,(err,data)=>{
          if(err){
            console.log(err)
            res.status(500).send('db error').end()
          }else{
            res.redirect('/wenlinqing/index')
          }
        })
    }

  });


  return router;
};
