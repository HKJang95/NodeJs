var express = require('express');
var topic = require('./lib/topic');
var bodyparser = require('body-parser');
var compression = require('compression');
var db = require('./lib/db');
var topicRouter = require('./routes/topic_route');
var authorRouter = require('./routes/author_route');
var helmet = require('helmet');
const { response } = require('express');
var usermgmt = require('./routes/usermgmt_route');

var session = require('express-session');
var app = express();
var sessionStore = require('./lib/session_db.js');

var app = express();
// middleware 사용 부분
app.use(bodyparser.urlencoded({extended: false})); // bodyparser : post 방식 body parsing용 -> express 기본 탑재
app.use(compression()); // 클라이언트 ~ 서버 전송내용 압축
app.use(express.static('public')); // public dir 내부 static 파일 찾기. public 내부의 파일 디렉토리를 URL 통해 접근 가능해짐. : 보안성 안전
app.use(helmet()); // 각종 보안솔루션 제공 모듈!!

app.use(session({
  key: 'is_logined',
  secret: 'mysecret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

app.use(session({
  key: 'nickname',
  secret: 'mysecret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

// get방식으로 들어오는 요청에만 전부 응답하고, 타 방식에는 db 가져오지 않음.
app.get('*',function(request, response, next){
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error){throw error;}
    request.list = topics;
    next(); //다음 미들웨어 실행
  });
  // 콤마로 이어져있으므로 밑 함수가 다음 미들웨어
}, function(request, response, next){
  db.query(`SELECT * FROM author`, function(error, authors){
    if(error){throw error;}
    request.author_list = authors;
    next(); // 다음 미들웨어 실행
  });
}); 
app.use('/user', usermgmt);

app.use('/topic', topicRouter);
// topic router 사용 (./routes/topic_route.js)

app.use('/author', authorRouter);
// author router 사용

// routing : 사용자가 path를 따라 들어올 때 적당한 대답을 해주는 것!
app.get('/', function(request, response){
    // topic에서 모든걸 긁어와 객체와 쿼리
  topic.home(request, response);
});

// 왜 이 위치 (앞이 아니라)에 있는 이유 : 미들웨어 순차적으로 접근하므로 여기까지 와서 실행돼야 함.
app.use(function(request, response, next){
  response.status(404).send('Sorry! file not found : 404!');
});

app.use(function(error, request, resposne, next){
  console.log(error.stack);
  response.status(500).send('something broke!');
});

app.listen(3000, function(){
  return console.log('Example app listening on port 3000!')
});
