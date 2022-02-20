var express = require('express');
var router = express.Router();
var usermgmt = require('../lib/usermgmt')

router.get('/login', function(request, response){
    usermgmt.login(request, response);
  });

router.post('/login_process', function(request, response){
  usermgmt.login_process(request, response);
});

router.get('/logout_process', function(request, response){
  usermgmt.logout_process(request, response);
});

module.exports = router;