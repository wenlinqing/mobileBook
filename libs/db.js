const mysql=require('mysql');

module.exports={
	db:mysql.createPool({host:'localhost',user:'root',database: 'db_wlq_test'})
}

