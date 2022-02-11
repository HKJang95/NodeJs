var url = require('url');
var qs = require('querystring');

var db = require('./db');
var template = require('./template.js');

exports.home = function(request, response){
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
};

exports.page = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error){throw error;}
  // root가 아닌 경우. Content Reading 부분.
  db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[queryData.id], function(error2, topic){
    if(error2){throw error2;}
    var title = topic[0].title;
    var description = topic[0].description;
    // template.js로 db에서 긁어온거 건네줌
    var list = template.list(topics);
    var html = template.HTML(title, list,
      `<h2>${title}</h2><p>${description}</p>
      <p>by ${topic[0].name}</p>`,
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
};

exports.create = function(request, response){
    // Content Create(쓰기) 부분
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error){throw error;}
    db.query(`SELECT * FROM author`, function(error2, authors){
      if(error2){throw error2;}
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
          ${template.authorselect(authors, '')}
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
  });
};

exports.create_process = function(request, response){
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

    db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`, [post.title, post.description, post.author], function(error, result){
      if(error){throw error;}
      response.writeHead(302, {Location: `/?id=${result.insertId}`});
      response.end();
    })
  });
};

exports.update = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error){throw error;}
  // root가 아닌 경우. Content Reading 부분.
  db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic){
    // queryData에서 id값을 받아온 뒤, 해당 id값에 해당하는 DB를 불러와 description에 활용.
    if(error2){throw error2;}
    // template.js로 db에서 긁어온거 건네줌
    db.query(`SELECT * FROM author`, function(error2, authors){
      var list = template.list(topics);
      var html = template.HTML(topic[0].title, topic[0].title,
        `
        <form action="/update_process" method="post">
        <input type="hidden" name="id" value="${topic[0].id}">
        <p><input type="text" name="title" value="${topic[0].title}"></p>
        <p>
            <textarea name="description">${topic[0].description}</textarea>
        </p>
        <p>
          ${template.authorselect(authors, topic[0].author_id)}
        </p>
        <p>
          <input type="submit">
        </p>
        </form>`,
        ``
      );
      response.writeHead(200);
      response.end(html);
      });
    });
  });
};

exports.update_process = function(request, response){
  var body = '';

  // Post Data 수신하는 부분.
  // 콜백이 조각조각 실행되는거라 보면 됨. 한번에 다 받으면 죽을 수 있으니까.. (데이터가 너무 크면)
  request.on('data', function(data){
      body += data;
  });

  request.on('end', function(){
    // 데이터 수신이 끝날 시 post data에 post 정보를 넣어줌.
    var post = qs.parse(body);
    db.query(`UPDATE topic SET title=?,description=?,author_id=? WHERE id=?`, [post.title, post.description, post.author, post.id], function(error, result){
      if(error){throw error;}
      response.writeHead(302, {Location: `/?id=${post.id}`});
      response.end();
    });
  });
};

exports.delete_process = function(request, response){
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
}
