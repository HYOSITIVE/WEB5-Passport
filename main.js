// Last Modification : 2021.06.08
// by HYOSITIVE
// based on WEB5 - Passport.js - 6

const port = 3000
var express = require('express')
var app = express()
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
app.use(helmet());
var session = require('express-session')
var FileStore = require('session-file-store')(session) // 실제로는 데이터베이스에 저장하는 것이 바람직함

app.use(express.static('public')); // public directory 안에서 static file을 찾겠다는 의미. public 폴더 안의 파일은 url을 통해 접근 가능

// 애플리케이션은 요청이 들어올 때마다 bodyparser, compression middleware를 실행

// bodyparser : 전송한 정보를 자동으로 분석해주는 middleware
// app.use()안의 내용은 bodyParser가 만들어내는 middleware를 표현하는 표현식
app.use(bodyParser.urlencoded({ extended: false}));

// compression : 웹 서버에서 정보를 압축해 전송해주는 middleware
// compression()함수가 middleware를 return
app.use(compression());

app.use(session({ // session middleware
  secret: 'keyboard cat', // 타인에게 유출하면 안됨. 실제 구현 시 변수처리하거나 외부에서 지정
  resave: false, // 세션 데이터가 바뀌기 전까지는 세션 저장소에 값을 저장하지 않는다
  saveUninitialized: true, // 세션이 필요하기 전까지는 세션을 구동시키지 않는다
	store:new FileStore()
}));

var authData = { // 실제 구현에서는 사용자 정보 주로 데이터베이스에 보관
	email:'hyositive_test@gmail.com',
	password:'111111',
	nickname:'hyositive'
};

// passport는 session을 내부적으로 사용하기 때문에, session을 활성화시키는 코드 다음에 passport 코드가 위치해야 한다.
var passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize()); // passport middleware Express에 설치
app.use(passport.session()); // passport를 통해 session 사용

passport.serializeUser(function(user, done) { // 로그인이 성공했을 때, 사용자의 식별자를 session store에 저장. serializeUser은 최초 로그인 성공 시 1회만 호출. 인증 성공 시, authData가 serializeUser의 callback 함수의 user에 들어감
	console.log('serializeUser', user);
	done(null, user.email); // session 데이터로 user.email 전송
});

passport.deserializeUser(function(id, done) { // 로그인 성공 후 다른 페이지에 방문할 때 마다 로그인 한 사용자인지 체크. 사용자 정보 조회를 위해 페이지에 방문할 때마다 deserializeUser 호출. 이를 위해 done의 인자에 원본 데이터 제공
	console.log('deserializeUser', id);
	done(null, authData); // done의 두 번째 인자로 주입한 유저 정보(authData)가 request의 user라는 객체로 전달
});

passport.use(new LocalStrategy(
	{ // passport local 인증을 위한 기본 데이터명은 'username', 'password'이지만, 직접 작성한 프로그램에서는 'email'과 'pwd'를 사용하므로, 명시적으로 알려줘야 함
		usernameField: 'email',
		passwordField: 'pwd'
},
  function(username, password, done) {
	  console.log('LocalStrategy', username, password);
	  if (username === authData.email) {
		  console.log(1);
		  if(password === authData.password) { // 인증 성공
			  console.log(2);
			  return done(null, authData); // serializeUser의 callback 함수 호출
		  }
		  else { // 잘못된 password 입력
			  console.log(3);
			  return done(null, false, { message: 'Incorrect password.' });
		  }
	  }
	  else { // 잘못된 email 입력
		  console.log(4);
		  return done(null, false, { message: 'Incorrect username.' });
	  }
  }
));

app.post('/auth/login_process', // passport API (local)
  passport.authenticate('local', { 
	successRedirect: '/',
	failureRedirect: '/auth/login' }));

// my middleware
// middleware의 함수는 request, response, next를 인자로 가짐
app.get('*', function(request, response, next){ // get 방식으로 들어오는 모든 요청에 대해
	fs.readdir('./data', function(error, filelist) {
		request.list = filelist; // 모든 route 안에서 request 객체의 list property를 통해 목록에 접근
		next(); // next에는 그 다음에 호출되어야 할 middleware 담김
	});
});

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/topic', topicRouter); // /topic으로 시작하는 주소들에게 topicRouter라는 middleware를 적용
// 이렇게 사용할 경우, topicRouter middleware에서 'topic' 경로를 다시 알려줄 필요 없음
app.use('/auth', authRouter);

app.use(function(req, res, next) { // 404 에러 처리 middleware
	res.status(404).send('Sorry cant find that!');	
});

app.use(function(err, req, res, next) { // 4개의 인자를 가진 함수는 Express에서 Error Handler middleware로 지정 
	console.error(err.stack);
	res.status(500).send('Something broke!');
})

app.listen(port, function() {console.log(`Example app listening at http://localhost:${port}`)});