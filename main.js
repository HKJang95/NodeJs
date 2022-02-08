var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var path = require('path');
var sanitizeHTML = require('sanitize-html');
var mysql = require('mysql');
var db = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'111111',
  database:'opentutorials'
});
db.connect();

var template = require('./lib/template.js');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
          // root의 경우
      if(queryData.id === undefined){
        // topic에서 모든걸 긁어와 객체와 쿼리
        db.query(`SELECT * FROM topic`, function(error, topics){
          if(error){throw error;}

          var title = 'Welcome!';
          var description = 'Hello, Node.js!';
          // template.js로 db에서 긁어온거 건네줌
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `<h2>${title}</h2><p>${description}</p>`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      } else {
        db.query(`SELECT * FROM topic`, function(error, topics){
          if(error){throw error;}
        // root가 아닌 경우. Content Reading 부분.
        db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic){
          if(error2){throw error2;}
          var title = topic[0].title;
          var description = topic[0].description;
          // template.js로 db에서 긁어온거 건네줌
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `<h2>${title}</h2><p>${description}</p>`,
            `<a href="/create">create</a>
              <a href="/update?id=${queryData.id}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
              </form>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
      }
    } else if(pathname === '/create') {
      // Content Create(쓰기) 부분
    db.query(`SELECT * FROM topic`, function(error, topics){
      if(error){throw error;}

      var title = 'Create';
      // template.js로 db에서 긁어온거 건네줌
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `<form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
            <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
        </form>`,
        `<a href="/create">create</a>`
      );
      response.writeHead(200);
      response.end(html);
    });
      // 실제 Create가 수행되는 부분. 파일 저장하는 부분임.
    } else if(pathname === '/create_process') {
      var body = '';

      // Post Data 수신하는 부분.
      // 콜백이 조각조각 실행되는거라 보면 됨. 한번에 다 받으면 죽을 수 있으니까.. (데이터가 너무 크면)
      request.on('data', function(data){
          body += data;
      });

      request.on('end', function(){
        // 데이터 수신이 끝날 시 post data에 post 정보를 넣어줌.
        var post = qs.parse(body);
        // post 데이터 기반 Write

        db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`, [post.title, post.description, 1], function(error, result){
          if(error){throw error;}
          response.writeHead(302, {Location: `/?id=${result.insertId}`});
          response.end();
        })
      });
    } else if (pathname === '/update') {
    db.query(`SELECT * FROM topic`, function(error, topics){
      if(error){throw error;}
    // root가 아닌 경우. Content Reading 부분.
    db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic){
      // queryData에서 id값을 받아온 뒤, 해당 id값에 해당하는 DB를 불러와 description에 활용.
      if(error2){throw error2;}
      // template.js로 db에서 긁어온거 건네줌
      var list = template.list(topics);
      var html = template.HTML(topic[0].title, topic[0].description,
        `<form action="/update_process" method="post">
        <input type="hidden" name="id" value="${topic[0].id}">
        <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
        <p>
            <textarea name="description" placeholder="description" >${topic[0].description}</textarea>
        </p>
        <p>
          <input type="submit">
        </p>
        </form>`,
        `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
      );
      response.writeHead(200);
      response.end(html);
    });
  });
  } else if (pathname === '/update_process') {
    var body = '';

    // Post Data 수신하는 부분.
    // 콜백이 조각조각 실행되는거라 보면 됨. 한번에 다 받으면 죽을 수 있으니까.. (데이터가 너무 크면)
    request.on('data', function(data){
        body += data;
    });

    request.on('end', function(){
      // 데이터 수신이 끝날 시 post data에 post 정보를 넣어줌.
      var post = qs.parse(body);
      db.query(`UPDATE topic SET title=?,description=? WHERE id=?`, [post.title, post.description, post.id], function(error, result){
        if(error){throw error;}
        response.writeHead(302, {Location: `/?id=${post.id}`});
        response.end();
      });
    });
  } else if (pathname === '/delete_process') {
    var body = '';

    // Post Data 수신하는 부분.
    // 콜백이 조각조각 실행되는거라 보면 됨. 한번에 다 받으면 죽을 수 있으니까.. (데이터가 너무 크면)
    request.on('data', function(data){
        body += data;
    });

    request.on('end', function(){
      // 데이터 수신이 끝날 시 post data에 post 정보를 넣어줌.
      var post = qs.parse(body);
      var id = post.id
      // file delete
      db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(error, result){
        if(error){throw error;}
        response.writeHead(302, {Location: `/`});
        response.end();
      });
    });
  } else {
      // 404 Error 처리
      response.writeHead(404);
      response.end('Not Found');
    }
});
app.listen(3000);
