var url = require('url');
var qs = require('querystring');

var db = require('./db');
var template = require('./template.js');
var sanitizeHtml = require('sanitize-html');

exports.home = function(request, response){
      var title = 'author';
      var list = template.list(request.list);
      var html = template.HTML(title, list,
        `
        <table>
          ${template.authortable(request.author_list)}
        </table>
        <style>
          table{
            border-collapse: collapse;
          }
          td{
            border:1px solid black;
          }
        </style>
        <form action="/author/author_create_process" method="post">
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
      response.send(html);
};
exports.author_create_process = function(request, response){
    // 데이터 수신이 끝날 시 post data에 post 정보를 넣어줌.
    var post = request.body;
    // post 데이터 기반 Write

    db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`, [post.name, post.profile], function(error, result){
      if(error){throw error;}
      response.redirect(`/author`);
    });
};

exports.author_update = function(request, response){
  var author_id = request.params.authorId;
      db.query(`SELECT * FROM author WHERE id=${author_id}`, function(error3, author_for_update){
        if(error3){throw error3;}
        var title = 'author update';
        var list = template.list(request.list);
        var html = template.HTML(title, list,
          `
          <table>
            ${template.authortable(request.author_list)}
          </table>
          <style>
            table{
              border-collapse: collapse;
            }
            td{
              border:1px solid black;
            }
          </style>
          <form action="/author/author_update_process" method="post">
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
        response.send(html)
      });
};

exports.author_update_process = function(request, response){
  
    // 데이터 수신이 끝날 시 post data에 post 정보를 넣어줌.
    var post = request.body;
    // post 데이터 기반 Write

    db.query(`UPDATE author SET name=?,profile=? WHERE id=?`, [post.name, post.profile, post.id], function(error, result){
      if(error){throw error;}
      response.redirect(`/author`);
    })
};

exports.author_delete_process = function(request, response){
  
    // 데이터 수신이 끝날 시 post data에 post 정보를 넣어줌.
    var post = request.body;
    var id = post.id
    // file delete
    db.query(`DELETE FROM author WHERE id=?`, [post.id], function(error, result){
      if(error){throw error;}
      response.redirect(`/author`);
    });
};
