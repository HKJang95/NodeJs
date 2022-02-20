var db = require('./db');
var template = require('./template.js');
var sanitizeHtml = require('sanitize-html');

exports.login = function(request, response){
    var title = 'Login';
    // template.js로 db에서 긁어온거 건네줌
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `<form action="login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="text" name="password" placeholder="password"></p>
        <p><input type="submit"></p>
      </form>
      `,
      `<a href="/create">create</a>`
    );
    response.send(html);
  };

exports.login_process = function(request, response){
  var post = request.body;
  var email = post.email;
  var password = post.password;
  // post 데이터 기반 Write
  if(email === 'gungod0601@gmail.com' && password === '111111') {
    response.cookie('email',email,{ expires: new Date(Date.now() + 900000), httpOnly: true });
    response.cookie('password',password,{ expires: new Date(Date.now() + 900000), httpOnly: true });
    response.cookie('nickname','Chang',{ expires: new Date(Date.now() + 900000), httpOnly: true });
    response.redirect(302,`/`);
  }
  else {
    response.redirect(302,`/`);
  }
  response.end();
}

exports.logout_process = function(request, response){
  // post 데이터 기반 Write
  response.cookie('email','',{ maxAge:0, httpOnly:true });
  response.cookie('password','',{ maxAge:0, httpOnly:true });
  response.cookie('nickname','',{ maxAge:0, httpOnly:true });
  response.redirect(302,`/`);
  response.end();
}
  