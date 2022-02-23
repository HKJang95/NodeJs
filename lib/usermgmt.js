var db = require('./db')
var template = require('./template.js');
var sanitizeHtml = require('sanitize-html');
var express = require('express');
var session = require('express-session');
var cookieparser = require('cookie-parser');
var app = express();

exports.login = function(request, response){
    var fmsg = request.flash();
    var login_fail_msg = ' ';
    if(fmsg.error) {
      login_fail_msg = fmsg.error[0];
    }
    var title = 'Login';
    // template.js로 db에서 긁어온거 건네줌
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `
      <div style="color:red;">${login_fail_msg}</div>
      <form action="/user/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="text" name="password" placeholder="password"></p>
        <p><input type="submit" value="login"></p>
      </form>
      `,
      `<a href="/create">create</a>`
    );
    response.send(html);
  };

exports.logout_process = function(request, response){
  // post 데이터 기반 Write
  request.logout();
  request.session.destroy(function(err){
    response.redirect(302,`/`);
    response.end();
  })
};

exports.authIsOwner = function(request, response){
  if(request.user){
    return true;
  }
  else {
    return false;
  }
};

exports.authStatusUI = function(request, response) {
  var authStatusUI = '<a href="/user/login">login</a>';
  if(this.authIsOwner(request, response)){
    var authStatusUI = `${request.user} | <a href="/user/logout_process">logout</a>`;
  }
  return authStatusUI;
};

