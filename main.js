var express = require('express');

var topic = require('./lib/topic');
var author = require('./lib/author');
var bodyparser = require('body-parser');
var compression = require('compression');
var db = require('./lib/db');

var app = express();
app.use(bodyparser.urlencoded({extended: false}));
app.use(compression());

app.get('*',function(request, response, next){
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error){throw error;}
    request.list = topics;
    next();
  });
}, function(request, response, next){
  db.query(`SELECT * FROM author`, function(error, authors){
    if(error){throw error;}
    request.author_list = authors;
    next(); // 다음 미들웨어 실행
  });
}); // get방식으로 들어오는 요청에만 응답하고, 타 방식에는 db 가져오지 않음.

// routing : 사용자가 path를 따라 들어올 때 적당한 대답을 해주는 것!
app.get('/', function(request, response){
    // topic에서 모든걸 긁어와 객체와 쿼리
  topic.home(request, response);
});

app.get('/page/:pageId', function(request, response){
    topic.page(request, response);
});

app.get('/create', function(request, response){
  topic.create(request, response);
});

app.post('/create_process', function(request, response){
  topic.create_process(request, response);
});

app.get('/update/:pageId', function(request, response){
  topic.update(request, response);
});

app.post('/page/update_process', function(request, response){
  topic.update_process(request, response);
});

app.post('/page/delete_process', function(request, response){
  topic.delete_process(request, response);
});

app.get('/author', function(request, response){
  author.home(request, response);
});

app.get('/author/author_update/:authorId', function(request, response){
  author.author_update(request, response);
});

app.post('/author/author_update_process', function(request, response){
  author.author_update_process(request, response);
});

app.post('/author/author_delete_process', function(request, response){
  author.author_delete_process(request, response);
});

app.post('/author/author_create_process', function(request, response){
  author.author_create_process(request, response);
});

app.listen(3000, function(){
  return console.log('Example app listening on port 3000!')
});
