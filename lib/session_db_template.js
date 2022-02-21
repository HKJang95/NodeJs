var session = require('express-session');
// session store를 위한 db 접근 express-mysql-session 객체 생성 후 전달
var MySQLStore = require('express-mysql-session')(session);

var options = {
  host: '',
  port: 0000,
  user: '',
  password: '',
  database: ''
};

var sessionStore = new MySQLStore(options);
module.exports = sessionStore;
