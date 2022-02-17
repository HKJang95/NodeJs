var express = require('express');
var router = express.Router();
var topic = require('../lib/author')

app.get('/', function(request, response){
    author.home(request, response);
  });
  
  app.get('/author_update/:authorId', function(request, response){
    author.author_update(request, response);
  });
  
  app.post('/author_update_process', function(request, response){
    author.author_update_process(request, response);
  });
  
  app.post('/author_delete_process', function(request, response){
    author.author_delete_process(request, response);
  });
  
  app.post('/author_create_process', function(request, response){
    author.author_create_process(request, response);
  });