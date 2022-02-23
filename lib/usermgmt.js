var template = require('./template.js');
var sanitizeHtml = require('sanitize-html');

var authData = {
  email:'gungod0601@gmail.com',
  password:'111111',
  nickname:'janghk1'
}

exports.login = function(request, response){
    var title = 'Login';
    // template.js로 db에서 긁어온거 건네줌
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `<form action="/user/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="text" name="password" placeholder="password"></p>
        <p><input type="submit" value="login"></p>
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
  if(email === authData.email && password === authData.password) {
    request.session.is_logined = true;
    request.session.nickname = authData.nickname;
    response.redirect(302,`/`);
  }
  else {
    response.redirect(302,`/`);
  }
  response.end();
}

exports.logout_process = function(request, response){
  // post 데이터 기반 Write
  request.session.destroy(function(error){
    if(error){
      throw error;
    }
  });
  response.redirect(302,`/`);
  response.end();
}