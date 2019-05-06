const express=require('express');
const common=require('../../libs/common');
const mysql=require('mysql');

const DBS=require('../../libs/db');
var db=DBS.db;

module.exports=function (){
  var router=express.Router();

  router.get('/',(req,res)=>{
    if (req.session['sessionTag']) {
      res.redirect('/mobile/index');
    }else{
      res.render('login.ejs',{});
    }
  });
  router.post('/',(req,res)=>{
    var username=req.body.username;
    var password=common.md5(req.body.password+common.MD5_SUFFIX);
    console.log(req.body)

    if (username==='admin') { // 管理员身份
      db.query(`SELECT * FROM admin WHERE username='${username}'`,(err,data)=>{
        if (err) {
          res.status(500).send('admin login database error').end();
        }else if (data.length==0) {
          res.status(400).send('no this admin').end();
        }else{
          if (data[0].password===password) {
            // 登入成功
            req.session['sessionTag']='admin';
            console.log('session admin',req.session)
            res.redirect('/mobile/index');
          }else{
            res.status(400).send('admin password is incorrect').end();
          }
        }
      })
    }else{ // 其他用户登入  电话号码登入
      db.query(`SELECT * FROM telbook WHERE tel='${username}'`,(err,data)=>{
        if (err) {
          res.status(500).send('commonUser login database error').end();
        }else if (data.length==0) {
          res.status(400).send('no this user').end();
        }else{
          if (data[0].password===password) {
            req.session['sessionTag']=username;
            res.redirect('/mobile/index');
          }else{
            res.status(400).send('commonUser password is incorrect').end();
          }
        }
      })
    }

    
  });


  return router;
};
