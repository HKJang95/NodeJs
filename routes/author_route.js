var express = require('express');
var router = express.Router();
var author = require('../lib/author')

router.get('/', function(request, response){
    author.home(request, response);
  });
  
router.get('/author_update/:authorId', function(request, response){
    author.author_update(request, response);
  });
  
router.post('/author_update_process', function(request, response){
    author.author_update_process(request, response);
  });
  
router.post('/author_delete_process', function(request, response){
    author.author_delete_process(request, response);
  });
  
router.post('/author_create_process', function(request, response){
    author.author_create_process(request, response);
  });
module.exports = router;