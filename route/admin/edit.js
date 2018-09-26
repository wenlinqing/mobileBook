const express=require('express');
const common=require('../../libs/common');
const mysql=require('mysql');
const pathLib=require('path');
const fs=require('fs');
const moment=require('moment');

const DBS=require('../../libs/db');
var db=DBS.db;

module.exports=function (){
  var router=express.Router();
  var telObj='';
  router.get('/',(req,res)=>{
    
    db.query(`SELECT * FROM telbook WHERE id='${req.query.id}'`,(err,data)=>{
      if (err) {
        console.log(err)
        res.status(500).send('db err').end()
      }else {
        if(data.length==0){
          res.status(400).send('not this people').end()
        }else{
          telObj=data[0].tel;
          if (data[0].tel==req.session['sessionTag']) { // 查询对应的手机 做判断 req.session['sessionTag']存了手机号
            res.render('add_people.ejs',{title:'修改人员信息', info:data[0], action: req.query.act, user:req.session['sessionTag'] });
          }else{
            console.log('不能修改其他人')
            res.render('add_people.ejs',{title:'修改人员信息', info:data[0], action: req.query.act, user:req.session['sessionTag'] });
          }
        }
      }
    });
    
  });

  router.post('/',(req,res)=>{
    var username=req.body.username;
    var tel=req.body.tel;
    console.log(req.body)
    var pwdBefore=common.md5(req.body.pwdBefore+common.MD5_SUFFIX);
    var pwd=req.body.password!=''?req.body.password:'123456';
    var password=common.md5(pwd+common.MD5_SUFFIX)

    var newFileName=null;
    if (req.files[0]) {
      var ext=pathLib.parse(req.files[0].originalname).ext;
      var oldPath=req.files[0].path;
      var newPath=req.files[0].path+ext;
      newFileName=req.files[0].filename+ext;
    }

    /*console.log('telObj==',telObj)
    return false*/
    
    if(newFileName){// 如果有更新图片  先判断原密码 再删除原图片  再更新数据   再上传(防止上传多余图片)
        db.query(`SELECT * FROM telbook WHERE tel=`+telObj,(err,data)=>{
            if (err) {
              console.log(err);
              res.status(500).send('not found user').end();
            }else{
              if (data[0].password==pwdBefore) { // 判断 原密码是否正确
                if (data[0].imgSrc!=''&&data[0].imgSrc!=undefined&&data[0].imgSrc!=null) {
                  fs.unlink('asset/upload/'+data[0].imgSrc,(err)=>{
                    if (err) {
                      console.log(err);
                      res.status(500).send('no 头像').end();
                    }else{
                      if (req.session['sessionTag']!='admin') {
                        var date=moment().format("YYYY-MM-DD HH:mm:ss");
                        db.query(`UPDATE telbook SET username='${username}',password='${password}',tel='${tel}',imgSrc='${newFileName}',modtime='${date}' \
                          WHERE tel=`+telObj,(err)=>{
                          if (err) {
                            console.log(err);
                            res.status(500).send('db error').send();
                          }else{
                            req.session['sessionTag']=tel;// 更新手机号后  重新设session
                            res.redirect('/wenlinqing/index');
                          }
                        });
                      }else{
                        var date=moment().format("YYYY-MM-DD HH:mm:ss");
                        db.query(`UPDATE telbook SET username='${username}',password='${password}',tel='${tel}',imgSrc='${newFileName}',modtime='${date}' \
                          WHERE tel=`+telObj,(err)=>{
                          if (err) {
                            console.log(err);
                            res.status(500).send('db error').send();
                          }else{
                            res.redirect('/wenlinqing/index');
                          }
                        });
                      }
                    }
                  })
                }else{// 不存在图片
                  if (req.session['sessionTag']!='admin') {
                    var date=moment().format("YYYY-MM-DD HH:mm:ss");
                    db.query(`UPDATE telbook SET username='${username}',password='${password}',tel='${tel}',imgSrc='${newFileName}',modtime='${date}' \
                      WHERE tel=`+telObj,(err)=>{
                      if (err) {
                        console.log(err);
                        res.status(500).send('db error').send();
                      }else{
                        req.session['sessionTag']=tel;// 更新手机号后  重新设session
                        res.redirect('/wenlinqing/index');
                      }
                    });
                  }else{
                    var date=moment().format("YYYY-MM-DD HH:mm:ss");
                    db.query(`UPDATE telbook SET username='${username}',password='${password}',tel='${tel}',imgSrc='${newFileName}',modtime='${date}' \
                      WHERE tel=`+telObj,(err)=>{
                      if (err) {
                        console.log(err);
                        res.status(500).send('db error').send();
                      }else{
                        res.redirect('/wenlinqing/index');
                      }
                    });
                  }                  
                }

                fs.rename(oldPath,newPath,(err)=>{ //再上传
                  if (err) {
                    console.log(err)
                    res.status(500).send('file error').send();
                  }else{
                    console.log('图片上传成功')

                  }
                });
              }else{
                res.status(400).send('原密码错误').end();
              }
            }
          });

      
    }else{// 直接更新信息  根据session查询
      db.query(`SELECT * FROM telbook WHERE tel=`+telObj,(err,data)=>{
        if (err) {
          console.log(err);
          res.status(500).send('not found user').end();
        }else{
          if (data[0].password==pwdBefore) { // 判断 原密码是否正确
              if (req.session['sessionTag']!='admin') {
                var date=moment().format("YYYY-MM-DD HH:mm:ss");
                db.query(`UPDATE telbook SET username='${username}',password='${password}',tel='${tel}',modtime='${date}' \
                 WHERE tel=`+telObj,(err)=>{
                  if (err) {
                    console.log(err);
                    res.status(500).send('db error').send();
                  }else{
                    req.session['sessionTag']=tel;// 更新手机号后  重新设session
                    res.redirect('/wenlinqing/index');
                  }
                });
              }else{
                var date=moment().format("YYYY-MM-DD HH:mm:ss");
                db.query(`UPDATE telbook SET username='${username}',password='${password}',tel='${tel}',modtime='${date}' \
                 WHERE tel=`+telObj,(err)=>{
                  if (err) {
                    console.log(err);
                    res.status(500).send('db error').send();
                  }else{
                    res.redirect('/wenlinqing/index');
                  }
                });
              }
          }else{
            res.status(400).send('原密码错误').end();
          }
        }
      });
    }
  })




  return router;
};
