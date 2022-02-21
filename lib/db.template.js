// db 직접접근 위한 객체생성 후 return
var mysql = require('mysql');
var db = mysql.createConnection({
  host:'mysql_addr',
  user:'mysql_username',
  password:'mysql_password',
  database:'mysql_database_name'
});
db.connect();
module.exports = db;


