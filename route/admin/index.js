const express=require('express');
const common=require('../../libs/common');

module.exports=function (){
  var router=express.Router();

  // 检查登录状态
  router.use((req,res,next)=>{
    if( !req.session['sessionTag'] && req.url!='/login' ){
      res.redirect('/mobile/admin/login');
    }else{
      res.locals.user=req.session['sessionTag'];
      next();
    }
  });

  router.get('/', (req, res)=>{
    res.render('index.ejs', {});
  });

  router.use('/login', require('./login')());
  router.use('/edit', require('./edit')());
  router.use('/delete', require('./delete')());


  return router;
};
