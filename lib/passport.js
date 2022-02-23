module.exports = function(app){
    var db = require('./db')
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.serializeUser(function(user, done){
      done(null, user);
    });
    
    passport.deserializeUser(function(id, done){
      done(null, id);
    });
    
    passport.use(new LocalStrategy(
        {usernameField:'email', passwordField:'password'},
        function(username, password, done){
          var sql = 'SELECT * FROM USER WHERE email=? and password=?'
          db.query(sql,[username, password], function(error, result){
            if(error){
              console.log(error);
              return done(error);
              throw error;
            }
            if(result.length === 0){
              return done(null, false, {message : 'Access Denied.'});
            } else {
              return done(null, result[0].nickname);
            }
          })
        }));
    return passport;
}
