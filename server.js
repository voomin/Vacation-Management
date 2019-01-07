var portnumber=8080;
var express = require('Express');
var app = express();
var things = require('./things.js');
var db = require('./db/con_db')();
db.test_open();



var files=['','/images','/css','/js','/vendor','/fonts','/SignImages'];
app.set('view engine', 'pug');
app.set('views','./views');
for(i in files)
  app.use(express.static('public'+files[i]));
app.use('/', things);




var server = app.listen(portnumber);


console.log("+ server open!! port:"+portnumber);
