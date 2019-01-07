var express = require('express');
var router = express.Router();
var db = require('./db/con_db')();
var fs = require('fs');//base64 이미지 저장 관련
//[body parser]------------------------------------------------------------------------//
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//------------------------------------------------------------------------------------//
//[session]---------------------------------------------------------------------------//
var session = require('express-session');
router.use(session({
  secret: '9+PF3ku:x9lV2#(%L3..ZJN^{7LXg+}',
  resave: false,
  saveUninitialized: true
}));
//------------------------------------------------------------------------------------//
var GuestPageUrls=["/login","/findId","/findMyId"];
var AdminRoute=(e)=>Judge(e,(e.req.session.user.stu_number=='human'));
var StudentRoute=(e)=>Judge(e,(e.req.session.user));
var Judge=(e,bool)=>(bool)
                    ? Route(e)
                    : e.res.redirect('/');	
var Route=function(e){
  if(e.sqls){
    if(e.sqls[0].sql.indexOf("select")>=0){
      db.select(e.sqls,function(err,result){
          if (err){
            console.log("select 하는데 문제가 발생했습니다.");
            e.res.redirect('/');
          }
          else {
            e.tos.select_result=result;
            e.res.render(e.url,e.tos);
          }
      });
    }//select indexof
    else if(e.sqls[0].sql.indexOf("?")>=0){
      db.query_val(e.sqls);
      e.res.redirect('/');	
    }else{
      db.query(e.sqls);
    }
  }else
    e.res.render(e.url,e.tos);
}
//------------------------------------------------------------------------------------//

router.use(function (req, res, next) {//기본적으로 여기 먼저 거치고 간다.
  if(req.session.user||GuestPageUrls.indexOf(req.originalUrl)>=0)//session이 존재하거나 로그인시도할때만 허용.
    next();
  else
    res.render('index');
});


router.get('/', function(req, res){
  if(req.session.user.stu_number)
      res.redirect(
        (req.session.user.stu_number=='human')
        ?'VacationLately'//admin 초기 페이지
        :'RestSelect'//student 초기 페이지
      );
	else
    res.render('index');
});
router.get('/SubjectAdd', function(req, res){
  AdminRoute({
    req:req,
    res:res,
    url:'admin'+req.originalUrl
  });
});
router.get('/StudentAdd', function(req, res){
  AdminRoute({
    req:req,
    res:res,
    url:'admin'+req.originalUrl,
    tos:{ 
      select_result : null
    },
    sqls:[
      {
      sql:"select * from hm_subject"
      }
    ]
  });
});
router.get('/VacationLately', function(req, res){
  AdminRoute({
    req:req,
    res:res,
    url:'admin'+req.originalUrl,
    tos:{ 
      select_result : null
    },
    sqls:[
      {
      sql:"select * from hm_rest_table where verified=0"
      }
    ]
  });
});
router.get('/VacationSelect', function(req, res){
  AdminRoute({
    req:req,
    res:res,
    url:'admin'+req.originalUrl,
    tos:{ 
      select_result : null
    },
    sqls:[
      {
        sql:"select * from hm_rest_table"
      }
    ]
  });
});
router.get('/StudentSelect', function(req, res){
  AdminRoute({
    req:req,
    res:res,
    url:'admin'+req.originalUrl,
    tos:{ 
      select_result : null
    },
    sqls:[
      {
        sql:"select * from hm_student"
      }
    ]
  });
});
router.get('/SignPage', function(req, res){
  StudentRoute({
    req:req,
    res:res,
    url:'student/SignPage'
  });
});
router.get('/RestReport', function(req, res){
  StudentRoute({
    req:req,
    res:res,
    url:'student/RestReport',
    tos:{ 
      stu_name : req.session.user.stu_name,
      available_rest : req.session.user.available_rest
    }
  });
});
router.get('/RestSelect', function(req, res){
  StudentRoute({
    req:req,
    res:res,
    url:'student/RestSelect',
    tos:{ 
      stu_name : req.session.user.stu_name,
      available_rest : req.session.user.available_rest,
      select_result : null
    },
    sqls:[
      {
        sql:"select * from hm_rest_table where stu_number='"+req.session.user.stu_number+"'"
      }
    ]
  });
});
router.get('/MyInfo_Admin', function(req, res){
  AdminRoute({
    req:req,
    res:res,
    url:'admin'+req.originalUrl,
    tos:{
      name:req.session.user.stu_name
    }
  });
});
router.get('/MyInfo_student', function(req, res){
  StudentRoute({
    req:req,
    res:res,
    url:'student/MyInfo_student',
    tos:{ 
      stu_name : req.session.user.stu_name,
      select_result : null
    },
    sqls:[
      {
        sql:"select * from hm_student where stu_number='"+req.session.user.stu_number+"'"
      }
    ]
  });
});
router.post('/RestCancle', urlencodedParser, function(req, res){
  AdminRoute({
    req:req,
    res:res,
    sqls:[
      {
        sql:"update hm_rest_table set verified=2 where rest_index="+req.body.restIndex
      }
    ]
  });
});
router.post('/RestConsent', urlencodedParser, function(req, res){
  AdminRoute({
    req:req,
    res:res,
    sqls:
    [
      {
        sql:"update hm_rest_table set verified=1 where rest_index=(?)",
        values:[req.body.restIndex]
      },
      {
        sql:"update hm_student set available_rest=available_rest-1 where stu_number=(?)",
        values:[req.body.stu_number]
      },
      {
        sql:"update hm_student set used_rest=used_rest+1 where stu_number=(?)",
        values:[req.body.stu_number]
      }
    ]
  });
});

router.post('/StudentUpdate', urlencodedParser, function(req, res){
  StudentRoute({
    req:req,
    res:res,
    sqls:[
      {
        sql:"update hm_student set stu_password=(?),stu_birthday=(?),stu_addr=(?),stu_phone=(?) where stu_number=(?)",
        values:[
          req.body.stu_password,
          req.body.stu_birthday,
          req.body.stu_addr,
          req.body.stu_phone,
          req.session.user.stu_number
        ]
      }
    ]
  });
});
router.post('/AdminUpdate', urlencodedParser, function(req, res){
  AdminRoute({
    req:req,
    res:res,
    sqls:
    [
      {
        sql:"update hm_student set stu_password=(?) where stu_number=(?)",
        values:[
          req.body.stu_password,
          req.session.user.stu_number
        ]
      }
    ]
  });
});
router.post('/insertStudent', urlencodedParser, function(req, res){
  AdminRoute({
    req:req,
    res:res,
    sqls:
    [
      {
        sql:"insert into hm_student values(?,?,?,?,?,?,?,?,?)",
        values:[
          req.body.sub_name,
          req.body.stu_name,
          req.body.stu_number,
          req.body.stu_password,
          req.body.stu_birthday,
          req.body.stu_addr,
          req.body.phone1+"-"+req.body.phone2+"-"+req.body.phone3,
          10,
          0
        ]
      }
    ]
  });
});
router.post('/insertSubject', urlencodedParser, function(req, res){
  AdminRoute({
    req:req,
    res:res,
    sqls:
    [
      {
        sql:"insert into hm_subject values(?,?,?)",
        values:[
          req.body.sub_name,
          req.body.start_day,
          req.body.end_day
        ]
      }
    ]
  });
});
router.post('/saveBase64', urlencodedParser, function(req, res){//휴가 신청 등록
  // string generated by canvas.toDataURL()
  var img = req.body.imgBase64;
  // Grab the extension to resolve any image error
  var ext = img.split(';')[0].match(/jpeg|png|gif/)[0];
  // strip off the data: url prefix to get just the base64-encoded bytes
  var data = img.replace(/^data:image\/\w+;base64,/, "");
  var buf = new Buffer(data, 'base64');
  var nowTime=new Date().toLocaleString().replace(/\s|\.|:/gi, "");
  var fileName=req.session.user.stu_number+"_"+nowTime+'.'+ ext;
  fs.writeFile('./public/SignImages/'+fileName, buf,(err) => err);
  StudentRoute({
    req:req,
    res:res,
    sqls:[
      {
        sql:"insert into hm_rest_table values(?,?,?,?,?,?,?,?,?,?,?)",
        values:[
          null,
          req.session.user.sub_name,
          req.session.user.stu_number,
          req.session.user.stu_name,
          req.session.user.used_rest,
          nowTime,
          req.body.rest_date,
          req.body.rest_reason,
          fileName,
          "대기중..",
          "0"
        ]
      }
    ]
  });
});
router.post('/RestCheck', urlencodedParser, function(req, res){
  StudentRoute({
    req:req,
    res:res,
    url:'student/RestCheck',
    tos:{ 
      stu_name : req.session.user.stu_name,
      rest_date: req.body.date,
      rest_reason: req.body.reason,
      sign_src : req.body.mySign_src,
    }
  });
});
router.post('/login', urlencodedParser, function(req, res){
  var user={
    id:req.body.user_id,
    password:req.body.user_password
  };
  db.login_check(user,function(err, content) {
    if (err) 
        console.log(err);
    else {
      if(content){
        req.session.user = content;
	      req.session.save();
      }else{
        console.log("아이디 와 비밀번호가 일치하지 않습니다. 또는 아이디가 존재하지 않습니다.");
      }
      res.redirect('/');		
    }
  });
});
router.get('/logout', function(req, res){
	req.session.destroy(function(){
    req.session;
    }); 
    res.redirect('/'); 
});

router.get('/findId', function(req, res){
  //res.render('content');var mysql_dbc = require('./db/con')();
res.render('findId');

});

router.post('/findMyId', urlencodedParser,function(req, res){
  //res.render('content');var mysql_dbc = require('./db/con')();
});
router.get('*', function(req, res){//404 page
  console.log("404 not found");
  res.redirect('/'); 
});


//export this router to use in our index.js
module.exports = router;
