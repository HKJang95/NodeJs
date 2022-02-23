var db = require('./db');
var template = require('./template.js');
var sanitizeHtml = require('sanitize-html');
var cookie = require('cookie');
var usermgmt = require('./usermgmt')

exports.home = function(request, response){
    var title = 'Welcome!';
    var description = 'Hello, Node.js!';
    // template.js로 db에서 긁어온거 건네줌
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `<h2>${title}</h2><p>${description}</p>
      <img src="/images/hello.jpg" style="width:500px; display:block; margine-top=10px"/>
      `,
      `<a href="/topic/create">create</a>`,usermgmt.authStatusUI(request, response)
    );
    response.send(html);
};

exports.page = function(request, response, next){
  var _url = request.url;
  // root가 아닌 경우. Content Reading 부분.
  db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[request.params.pageId], function(error2, topic){
    if(error2 || !topic[0]){
      next(error2);
      } 
    else {
      var title = topic[0].title;
      var description = topic[0].description;
      // template.js로 db에서 긁어온거 건네줌
      var list = template.list(request.list);
      var html = template.HTML(title, list,
        `<h2>${sanitizeHtml(title)}</h2><p>${sanitizeHtml(description)}</p>
        <p>by ${sanitizeHtml(topic[0].name)}</p>`,
        `<a href="/topic/create">create</a>
          <a href="/topic/update/${request.params.pageId}">update</a>
          <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${request.params.pageId}">
            <input type="submit" value="delete">
          </form>`,usermgmt.authStatusUI(request, response)
      );
        response.send(html);
    }
    });
    
};

exports.create = function(request, response){
    // Content Create(쓰기) 부분
  
    db.query(`SELECT * FROM author`, function(error2, authors){
      if(error2){throw error2;}
      var title = 'Create';

      // template.js로 db에서 긁어온거 건네줌
      var list = template.list(request.list);
      var html = template.HTML(sanitizeHtml(title), list,
        `<form action="/topic/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
            <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          ${template.authorselect(authors, '')}
        </p>
        <p>
          <input type="submit">
        </p>
        </form>`,
        `<a href="/topic/create">create</a>`,usermgmt.authStatusUI(request, response)
      );
      response.send(html);
    });
};

exports.create_process = function(request, response){
  // 데이터 수신이 끝날 시 post data에 post 정보를 넣어줌.
  if(!usermgmt.authIsOwner(request, response)){
    response.end('Login required!!')
    return false;
  }

  var post = request.body;
  // post 데이터 기반 Write
  db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`, [post.title, post.description, post.author], function(error, result){
    if(error){throw error;}
    response.redirect(302,`/topic/${result.insertId}`);
    response.end();
  });
};

exports.update = function(request, response){
  // root가 아닌 경우. Content Reading 부분.
  db.query(`SELECT * FROM topic WHERE id=?`,[request.params.pageId], function(error2, topic){
    // queryData에서 id값을 받아온 뒤, 해당 id값에 해당하는 DB를 불러와 description에 활용.
    if(error2){throw error2;}
    // template.js로 db에서 긁어온거 건네줌
    db.query(`SELECT * FROM author`, function(error2, authors){
      var list = template.list(request.list);
      var html = template.HTML(sanitizeHtml(topic[0].title), sanitizeHtml(topic[0].title),
        `
        <form action="/topic/update_process" method="post">
        <input type="hidden" name="id" value="${topic[0].id}">
        <p><input type="text" name="title" value="${sanitizeHtml(topic[0].title)}"></p>
        <p>
            <textarea name="description">${sanitizeHtml(topic[0].description)}</textarea>
        </p>
        <p>
          ${template.authorselect(authors, topic[0].author_id)}
        </p>
        <p>
          <input type="submit">
        </p>
        </form>`,
        ``,usermgmt.authStatusUI(request, response)
      );
      response.send(html);
      });
    });
};

exports.update_process = function(request, response){
  
  var post = request.body;
  db.query(`UPDATE topic SET title=?,description=?,author_id=? WHERE id=?`, [post.title, post.description, post.author, post.id], function(error, result){
    if(error){throw error;}
    response.redirect(`/topic/${post.id}`);
  });
};

exports.delete_process = function(request, response){
  var post = request.body;
  var id = post.id;
  // file delete
  db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(error, result){
    if(error){throw error;}
    response.redirect(`/`);
  });
};