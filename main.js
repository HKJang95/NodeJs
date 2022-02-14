/*
var http = require('http');
var url = require('url');
var qs = require('querystring');
var db = require('./lib/db');
var topic = require('./lib/topic');
var template = require('./lib/template.js');
var author = require('./lib/author');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
          // root의 경우
      if(queryData.id === undefined){
        // topic에서 모든걸 긁어와 객체와 쿼리
        topic.home(request, response);
      } else {
        topic.page(request, response);
      }
    } else if(pathname === '/create') {
      topic.create(request, response);
      // 실제 Create가 수행되는 부분. 파일 저장하는 부분임.
    } else if(pathname === '/create_process') {
      topic.create_process(request, response);
    } else if (pathname === '/update') {
      topic.update(request, response);
    } else if (pathname === '/update_process') {
      topic.update_process(request, response);
    } else if (pathname === '/delete_process') {
      topic.delete_process(request, response);
    } else if (pathname === '/author') {
      author.home(request, response);
    } else if (pathname === '/author_update') {
      author.author_update(request, response);
    } else if (pathname === '/author_create_process') {
      author.author_create_process(request, response);
    } else if (pathname === '/author_update_process') {
      author.author_update_process(request, response);
    } else if (pathname === '/author_delete_process') {
      author.author_delete_process(request, response);
    } else {
      // 404 Error 처리
      response.writeHead(404);
      response.end('Not Found');
    }
});
app.listen(3000);
*/

var express = require('express');

var topic = require('./lib/topic');
var author = require('./lib/author');

var app = express();

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
