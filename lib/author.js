var url = require('url');
var qs = require('querystring');

var db = require('./db');
var template = require('./template.js');
var author = require('./author');
var sanitizeHtml = require('sanitize-html');

exports.home = function(request, response){
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error){throw error;}
    db.query(`SELECT * FROM author`, function(error2, authors){
      if(error2){throw error2;}

      var title = 'author';
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `
        <table>
          ${template.authortable(authors)}
        </table>
        <style>
          table{
            border-collapse: collapse;
          }
          td{
            border:1px solid black;
          }
        </style>
        <form action="/author_create_process" method="post">
        <p><input type="text" name="name" placeholder="name"></p>
        <p>
            <textarea name="profile" placeholder="profile"></textarea>
        </p>
        <p>
          <input type="submit" value="Create">
        </p>
        </form>
        `,
        ``
      );

      response.writeHead(200);
      response.end(html);
    });
  });
};
exports.author_create_process = function(request, response){
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

    db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`, [post.name, post.profile], function(error, result){
      if(error){throw error;}
      response.writeHead(302, {Location: `/author`});
      response.end();
    })
  });
};

exports.author_update = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var author_id = queryData.id;
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error){throw error;}
    db.query(`SELECT * FROM author`, function(error2, authors){
      if(error2){throw error2;}
      db.query(`SELECT * FROM author WHERE id=${author_id}`, function(error3, author_for_update){
        if(error3){throw error3;}
        var title = 'author update';
        var list = template.list(topics);
        var html = template.HTML(title, list,
          `
          <table>
            ${template.authortable(authors)}
          </table>
          <style>
            table{
              border-collapse: collapse;
            }
            td{
              border:1px solid black;
            }
          </style>
          <form action="/author_update_process" method="post">
          <input type="hidden" name="id" value="${author_for_update[0].id}">
          <p><input type="text" name="name" placeholder="name" value="${sanitizeHtml(author_for_update[0].name)}"></p>
          <p>
              <textarea name="profile" placeholder="profile">${sanitizeHtml(author_for_update[0].profile)}</textarea>
          </p>
          <p>
            <input type="submit" value="Update">
          </p>
          </form>
          `,
          ``
        );

        response.writeHead(200);
        response.end(html);
      });
    });
  });
};

exports.author_update_process = function(request, response){
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

    db.query(`UPDATE author SET name=?,profile=? WHERE id=?`, [post.name, post.profile, post.id], function(error, result){
      if(error){throw error;}
      response.writeHead(302, {Location: `/author`});
      response.end();
    })
  });
};

exports.author_delete_process = function(request, response){
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
    db.query(`DELETE FROM author WHERE id=?`, [post.id], function(error, result){
      if(error){throw error;}
      response.writeHead(302, {Location: `/author`});
      response.end();
    });
  });
};
