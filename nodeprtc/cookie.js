var http = require('http');
var cookie = require('cookie');
http.createServer(function(req,res){
    res.writeHead(200, {
        'Set-Cookie':[
            'yummy_cookie=choco', 
            'tasty_cookie=strawberry',
            `Permanent=cookies; Max-Age=${3600}`,
            'Secure=Secure; Secure',
            'HttpOnly=HttpOnly; HttpOnly',
            'Path=path; path=/cookie'
        ]
    });
    if(req.headers.cookie !== undefined){
        var cookies = cookie.parse(req.headers.cookie)
        console.log(cookies.yummy_cookie);
    }
    res.end('cookie');

}).listen(3000);