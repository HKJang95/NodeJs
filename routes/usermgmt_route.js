var express = require('express');
var router = express.Router();
var usermgmt = require('../lib/usermgmt');

module.exports = function(passport){

  router.get('/login', function(request, response){
    usermgmt.login(request, response);
  });

  router.get('/logout_process', function(request, response){
    usermgmt.logout_process(request, response);
  });

  router.post('/login_process', passport.authenticate('local',{
    successRedirect : '/', 
    failureRedirect: '/user/login',
    failureFlash: truekaav
    })
  );

  return router;
};