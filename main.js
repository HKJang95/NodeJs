var http = require('http');
var url = require('url')
var fs = require('fs');

// 실질적으로 사용자에게 보여주는 part. (HTML 파일)
// template. title, list, body를 통해 제목, 리스트, body를 결정함
/*
  title
  list
  (
    listTemplate
  )
  body
*/
function templateHTML(title, list, body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a>
    ${body}
  </body>
  </html>
  `
}

// list의 template
// 상단 templateHTML함수의 list부분 참고.
/*
  list(
    1
    2
    3
    // listTemplate
  )
*/
function listTemplate(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i++;
  }
  list = list + '</ul>';

  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname
    if(pathname === '/'){
          // root의 경우
      if(queryData.id === undefined){
        // /뒤의 내용이 undefined인 경우
          fs.readdir('./data', function(error, filelist){
            // readdir을 통해 filelist라는 배열 형태로 파일들을 불러올 수 있음. ['CSS', 'HTML', 'JavaScript']
            var title = 'Welcome!';
            var description = 'Hello, Node.js!';
            var list = listTemplate(filelist);
            var template = templateHTML(title, list,`<h2>${title}</h2><p>${description}</p>`);
          response.writeHead(200);
          response.end(template);
          })

      } else {
        // root가 아닌 경우 (/?id=content)
        fs.readdir('./data', function(error, filelist){
          // queryData에서 id값을 받아온 뒤, 해당 id값에 해당하는 file을 불러와 description에 활용.
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
              var title = queryData.id;
              var list = listTemplate(filelist);
              var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
          response.writeHead(200);
          response.end(template);
          });
      });
      }
    } else if(pathname === '/create'){
      fs.readdir('./data', function(error, filelist){
        // readdir을 통해 filelist라는 배열 형태로 파일들을 불러올 수 있음. ['CSS', 'HTML', 'JavaScript']
        var title = 'WEB - Create';
        var list = listTemplate(filelist);
        var template = templateHTML(title, list,`
          <form action="http://localhost:3000/process_create" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
              <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
          </form>
          `);
      response.writeHead(200);
      response.end(template);
      })

    } else {
      // 404 Error 처리
      response.writeHead(404);
      response.end('Not Found');
    }
});
app.listen(3000);
