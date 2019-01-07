const sqlite3 = require('sqlite3').verbose();
var DB_src='./db/databases/hm.db';
module.exports = function () {
  return {
    test_open: function () {
        let db = new sqlite3.Database(DB_src, (err) => {
          if (err) 
            console.error('sqlite connection error :' + err);
          else 
            console.info('+ sqlite is connected successfully.');
        });
        db.close();
    },
    query_val: function (sqls) {//(?,?,?) value형식
      let db = new sqlite3.Database(DB_src);
      db.serialize(function(){
        db.exec("BEGIN");
        for(i in sqls){
          var stmt = db.prepare(sqls[i].sql);
          stmt.run(...sqls[i].values);
          stmt.finalize();
        }
        db.exec("COMMIT");
      });
      db.close();
    },
    query: function (sqls) {//기본적인 insert update문 형식
      let db = new sqlite3.Database(DB_src);
      db.serialize(function(){
        db.exec("BEGIN");
        for(i in sqls){
         db.run(sqls[i].sql,[],(err)=>err);
        }
        db.exec("COMMIT");
      });
      db.close();
    },
    select: function (sqls,callback) {
      let db = new sqlite3.Database(DB_src);
      db.all(sqls[0].sql,[],function(err, rows){
        if(err){
          callback(err,null);
        }
        else{
          for(i in rows)
            rows[i].stu_password="*****";//비밀번호 보안
          callback(err, rows);
        }
      });
      db.close();
    },
    login_check: function (user,callback) {
      var sql="select * from HM_student where stu_number='"+user.id+"' and stu_password = '"+user.password+"'";
      let db = new sqlite3.Database(DB_src);
      db.all(sql,[],function(err, rows){
        if(err)
        throw err;
        if(rows.length>0){//해당 아이디와 해당 비밀번호가 있으면 검색결과가 있으므로 rows는 1이상
          rows[0].stu_password="*****";//비밀번호 보안.
          callback(err, rows[0]);
        }
        else{
          callback(err, false);
        }
      });
      db.close();
    }
  }
};
