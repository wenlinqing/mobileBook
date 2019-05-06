const express=require('express');
const common=require('../../libs/common');
const mysql=require('mysql');
const fs=require('fs');

const DBS=require('../../libs/db');
var db=DBS.db;

module.exports=function (){
  var router=express.Router();
  
  router.get('/',(req,res)=>{
    db.query(`SELECT * FROM telbook WHERE id='${req.query.id}'`,(err,data)=>{
      if (err) {
        console.error(err);
        res.status(500).send('db error').end();
      }else if(data.length===0){
        res.status(400).send('no this information').end();
      }else{
        if (data[0].imgSrc!=''&&data[0].imgSrc!=undefined&&data[0].imgSrc!=null) {
          fs.unlink('asset/upload/'+data[0].imgSrc,(err)=>{
            if (err) {
              res.status(500).send('file errors').end();
            }else{
              db.query(`DELETE FROM telbook WHERE id='${req.query.id}'`,(err,data)=>{
                if (err) {
                  res.status(500).send('db error').end();
                }else{
                  res.redirect('/mobile/index');
                }
              })
            }
          })
        }else{
          db.query(`DELETE FROM telbook WHERE id='${req.query.id}'`,(err,data)=>{
            if (err) {
              res.status(500).send('db error').end();
            }else{
              res.redirect('/mobile/index');
            }
          })
        }
          
      }
    })
  });


  return router;
};
