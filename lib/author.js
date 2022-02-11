var url = require('url');
var qs = require('querystring');

var db = require('./db');
var template = require('./template.js');

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
        `,
        `<a href="/create">create</a>`
      );

      response.writeHead(200);
      response.end(html);
    });
  });
};
